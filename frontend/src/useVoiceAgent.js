import { useRef, useState, useCallback } from 'react'

const WIRE_RATE = 24_000

const CAPTURE_WORKLET = `
  class CaptureProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this._ratio = sampleRate / ${WIRE_RATE};
      this._pos = 0;
      this._prev = 0;
      this._src = null;
      this._out = null;
    }
    _toPcm(samples, len) {
      const pcm = new Int16Array(len);
      for (let i = 0; i < len; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      return pcm;
    }
    process(inputs) {
      const ch = inputs[0]?.[0];
      if (!ch) return true;
      if (this._ratio === 1) {
        const pcm = this._toPcm(ch, ch.length);
        this.port.postMessage(pcm.buffer, [pcm.buffer]);
        return true;
      }
      const n = ch.length;
      if (!this._src || this._src.length < n + 1) {
        this._src = new Float32Array(n + 1);
        this._out = new Float32Array(Math.ceil((n + 1) / this._ratio) + 2);
      }
      const src = this._src;
      const out = this._out;
      src[0] = this._prev;
      src.set(ch, 1);
      let outLen = 0;
      let pos = this._pos;
      while (pos < n) {
        const i = Math.floor(pos);
        const frac = pos - i;
        out[outLen++] = src[i] + (src[i + 1] - src[i]) * frac;
        pos += this._ratio;
      }
      this._pos = pos - n;
      this._prev = ch[n - 1];
      if (outLen) {
        const pcm = this._toPcm(out, outLen);
        this.port.postMessage(pcm.buffer, [pcm.buffer]);
      }
      return true;
    }
  }
  registerProcessor('capture', CaptureProcessor);
`

const PLAYBACK_WORKLET = `
  class PlaybackProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this._ring = new Float32Array(sampleRate * 30);
      this._writePos = 0;
      this._readPos = 0;
      this._available = 0;
      this._step = ${WIRE_RATE} / sampleRate;
      this._rsPos = 0;
      this._rsPrev = 0;
      this._drained = false;
      this.port.onmessage = (e) => {
        if (e.data === 'stop') {
          this._writePos = this._readPos = this._available = 0;
          this._rsPos = this._rsPrev = 0;
          return;
        }
        const int16 = new Int16Array(e.data);
        if (!int16.length) return;
        if (this._drained) {
          this._rsPrev = 0;
          this._rsPos = 0;
          this._drained = false;
        }
        if (this._step === 1) {
          for (let i = 0; i < int16.length; i++) this._push(int16[i] / 32768);
          return;
        }
        const n = int16.length;
        let pos = this._rsPos;
        while (pos < n) {
          const i = Math.floor(pos);
          const frac = pos - i;
          const a = i === 0 ? this._rsPrev : int16[i - 1] / 32768;
          const b = int16[i] / 32768;
          this._push(a + (b - a) * frac);
          pos += this._step;
        }
        this._rsPos = pos - n;
        this._rsPrev = int16[n - 1] / 32768;
      };
    }
    _push(v) {
      if (this._available < this._ring.length) {
        this._ring[this._writePos] = v;
        this._writePos = (this._writePos + 1) % this._ring.length;
        this._available++;
      }
    }
    process(inputs, outputs) {
      const output = outputs[0];
      const out = output[0];
      const cap = this._ring.length;
      for (let i = 0; i < out.length; i++) {
        if (this._available > 0) {
          out[i] = this._ring[this._readPos];
          this._readPos = (this._readPos + 1) % cap;
          this._available--;
        } else {
          out[i] = 0;
          this._drained = true;
        }
      }
      for (let ch = 1; ch < output.length; ch++) output[ch].set(out);
      return true;
    }
  }
  registerProcessor('playback', PlaybackProcessor);
`

const blobUrl = (code) =>
  URL.createObjectURL(new Blob([code], { type: 'application/javascript' }))

async function addWorklet(ctx, code, name) {
  const url = blobUrl(code)
  try {
    await ctx.audioWorklet.addModule(url)
  } finally {
    URL.revokeObjectURL(url)
  }
  return new AudioWorkletNode(ctx, name)
}

const AGENT_ID = import.meta.env.VITE_ASSEMBLYAI_AGENT_ID
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

export function useVoiceAgent() {
  const [status, setStatus] = useState('idle')
  const [transcript, setTranscript] = useState([])

  const wsRef = useRef(null)
  const captureCtxRef = useRef(null)
  const playbackCtxRef = useRef(null)
  const playbackRef = useRef(null)
  const micRef = useRef(null)

  const addLine = useCallback((who, text) => {
    setTranscript((prev) => [...prev, { who, text, id: Date.now() + Math.random() }])
  }, [])

  const cleanup = useCallback(() => {
    playbackRef.current?.port.postMessage('stop')
    micRef.current?.getTracks().forEach((track) => track.stop())
    captureCtxRef.current?.close()
    playbackCtxRef.current?.close()
    captureCtxRef.current = playbackCtxRef.current = playbackRef.current = micRef.current = null
  }, [])

 const stop = useCallback(() => {
  const ws = wsRef.current
  setStatus('ending')
  if (ws?.readyState === 1) {
    ws.send(JSON.stringify({ type: 'session.end' }))
    setTimeout(() => { if (ws.readyState === 1) ws.close() }, 3000)
  } else {
    ws?.close()
    cleanup()
    setStatus('idle')
  }
}, [cleanup])

  const start = useCallback(async () => {
    if (!AGENT_ID) {
      setStatus('error')
      addLine('system', 'Missing VITE_ASSEMBLYAI_AGENT_ID in frontend/.env')
      return
    }
    setStatus('connecting')

    try {
      const res = await fetch(`${BACKEND_URL}/api/voice-token`)
      if (!res.ok) {
        setStatus('error')
        addLine('system', 'Could not get a voice token from the backend.')
        return
      }
      const { token } = await res.json()

      const captureCtx = new AudioContext({ sampleRate: WIRE_RATE })
      const playbackCtx = new AudioContext({ sampleRate: WIRE_RATE })
      await Promise.all([captureCtx.resume(), playbackCtx.resume()])
      captureCtxRef.current = captureCtx
      playbackCtxRef.current = playbackCtx

      const playback = await addWorklet(playbackCtx, PLAYBACK_WORKLET, 'playback')
      playback.connect(playbackCtx.destination)
      playbackRef.current = playback

      const mic = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: false, autoGainControl: false },
      })
      micRef.current = mic

      const capture = await addWorklet(captureCtx, CAPTURE_WORKLET, 'capture')
      captureCtx.createMediaStreamSource(mic).connect(capture)

      const url = new URL('wss://agents.assemblyai.com/v1/ws')
      url.searchParams.set('token', token)
      const ws = new WebSocket(url)
      wsRef.current = ws
      let ready = false

      capture.port.onmessage = ({ data }) => {
        if (!ready || ws.readyState !== 1) return
        const bytes = new Uint8Array(data)
        let binary = ''
        for (let i = 0; i < bytes.length; i += 0x8000) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
        }
        ws.send(JSON.stringify({ type: 'input.audio', audio: btoa(binary) }))
      }

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'session.update', session: { agent_id: AGENT_ID } }))
      }

      ws.onmessage = ({ data }) => {
        const msg = JSON.parse(data)
        switch (msg.type) {
          case 'session.ready':
            ready = true
            setStatus('listening')
            break
          case 'input.speech.started':
            playbackRef.current?.port.postMessage('stop')
            setStatus('listening')
            break
          case 'reply.started':
            setStatus('speaking')
            break
          case 'reply.audio': {
            const raw = atob(msg.data)
            const bytes = new Uint8Array(raw.length)
            for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
            playbackRef.current?.port.postMessage(bytes.buffer, [bytes.buffer])
            break
          }
          case 'reply.done':
            setStatus('listening')
            if (msg.status === 'interrupted') playbackRef.current?.port.postMessage('stop')
            break
          case 'transcript.user':
            addLine('you', msg.text)
            break
          case 'transcript.agent':
            addLine('agent', msg.text)
            break
          case 'tool.call':
            addLine('tool', `${msg.name}(${JSON.stringify(msg.arguments ?? {})})`)
            break
          case 'session.ended':
            ws.close()
            break
          case 'session.error':
            setStatus('error')
            addLine('system', msg.message)
            break
          default:
            break
        }
      }

      ws.onclose = () => { setStatus('idle'); cleanup() }
      ws.onerror = () => { setStatus('error') }
    } catch (error) {
      setStatus('error')
      addLine('system', error.message)
    }
  }, [addLine, cleanup])

  return { status, transcript, start, stop }
}