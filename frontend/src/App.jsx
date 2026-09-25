import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoiceAgent } from './useVoiceAgent'
import { MascotPlaceholder } from './components/MascotPlaceholder'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''

// ============================================================================
// ILLUSTRATED NEUBRUTALIST PENGUIN PORTRAIT (Zero-blank, 100% Vector & Reactive)
// ============================================================================
function PenguinPortrait({ status, isStartled, size = 'lg' }) {
  const isSpeaking = status === 'speaking'
  const isListening = status === 'listening'
  const isConnected = status === 'connected' || isListening || isSpeaking
  const isConnecting = status === 'connecting'

  const dims = size === 'sm' ? 'w-14 h-14' : 'w-48 h-48 sm:w-56 sm:h-56'

  return (
    <motion.div
      className={`relative ${dims} flex items-center justify-center select-none pointer-events-none`}
      animate={
        isSpeaking
          ? { y: [0, -6, 0, -4, 0], rotate: [0, 2, -2, 1, 0] }
          : isListening
          ? { scale: [1, 1.04, 1], y: [0, -3, 0] }
          : isStartled
          ? { scale: [1, 1.12, 1], y: [0, -10, 0] }
          : { y: [0, -4, 0] }
      }
      transition={{
        duration: isSpeaking ? 0.6 : isListening ? 1.4 : 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[2px_2px_0px_#000]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="earcupGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE53B" />
            <stop offset="100%" stopColor="#E5C800" />
          </radialGradient>
        </defs>

        {/* --- Background Audio Waves when Speaking/Listening --- */}
        {(isSpeaking || isListening) && (
          <g className="animate-pulse">
            <path
              d="M 28 85 A 75 75 0 0 0 28 135"
              fill="none"
              stroke="#000"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 18 75 A 90 90 0 0 0 18 145"
              fill="none"
              stroke="#00D2FF"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 172 85 A 75 75 0 0 1 172 135"
              fill="none"
              stroke="#000"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 182 75 A 90 90 0 0 1 182 145"
              fill="none"
              stroke="#A6FF00"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* --- Headband of Headset (behind head) --- */}
        <path
          d="M 45 100 C 45 42, 155 42, 155 100"
          fill="none"
          stroke="#111"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 45 100 C 45 42, 155 42, 155 100"
          fill="none"
          stroke="#FFE53B"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* --- Main Penguin Body (Outer Silhouette) --- */}
        <ellipse
          cx="100"
          cy="116"
          rx="62"
          ry="68"
          fill="#1E1F24"
          stroke="#000"
          strokeWidth="5"
        />

        {/* Little Left Wing / Flipper */}
        <path
          d="M 44 115 C 32 130, 36 150, 48 152 C 54 145, 52 130, 48 118 Z"
          fill="#1E1F24"
          stroke="#000"
          strokeWidth="4"
        />

        {/* Little Right Wing / Flipper */}
        <path
          d="M 156 115 C 168 130, 164 150, 152 152 C 146 145, 148 130, 152 118 Z"
          fill="#1E1F24"
          stroke="#000"
          strokeWidth="4"
        />

        {/* --- White Cream Belly / Chest --- */}
        <ellipse
          cx="100"
          cy="124"
          rx="44"
          ry="52"
          fill="#FFFDF7"
          stroke="#000"
          strokeWidth="4.5"
        />

        {/* Neubrutalist Sketch Shadow Marks on Belly */}
        <path d="M 72 144 L 80 152" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 80 148 L 88 156" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 88 152 L 96 160" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />

        {/* --- Rosy Cheeks --- */}
        <ellipse cx="68" cy="110" rx="10" ry="7" fill="#FF5E36" opacity="0.85" />
        <ellipse cx="132" cy="110" rx="10" ry="7" fill="#FF5E36" opacity="0.85" />
        {/* Sketch dashes on cheeks */}
        <path d="M 64 109 L 68 113" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        <path d="M 128 109 L 132 113" stroke="#000" strokeWidth="2" strokeLinecap="round" />

        {/* --- Eyes (Animated Blinking & Tracking) --- */}
        <g>
          {/* Left Eye Socket */}
          <ellipse
            cx="80"
            cy="94"
            rx="11"
            ry="14"
            fill="#FFF"
            stroke="#000"
            strokeWidth="3.5"
          />
          {/* Left Pupil */}
          <ellipse cx="82" cy="94" rx="6" ry="8" fill="#000" />
          {/* Eye Sparkle Catchlight */}
          <circle cx="80" cy="91" r="2.5" fill="#FFF" />
          <circle cx="84" cy="97" r="1.2" fill="#FFF" />

          {/* Right Eye Socket */}
          <ellipse
            cx="120"
            cy="94"
            rx="11"
            ry="14"
            fill="#FFF"
            stroke="#000"
            strokeWidth="3.5"
          />
          {/* Right Pupil */}
          <ellipse cx="118" cy="94" rx="6" ry="8" fill="#000" />
          {/* Eye Sparkle Catchlight */}
          <circle cx="116" cy="91" r="2.5" fill="#FFF" />
          <circle cx="120" cy="97" r="1.2" fill="#FFF" />
        </g>

        {/* Eyebrows (Cute expressive tufts) */}
        <path
          d={isStartled ? "M 70 76 Q 80 70 90 76" : "M 72 78 Q 80 76 88 80"}
          fill="none"
          stroke="#000"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d={isStartled ? "M 110 76 Q 120 70 130 76" : "M 112 80 Q 120 76 128 78"}
          fill="none"
          stroke="#000"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* --- Beak (Golden Orange) --- */}
        {isSpeaking ? (
          // Open talking beak
          <g>
            <path
              d="M 87 104 Q 100 96 113 104 Q 100 120 87 104 Z"
              fill="#FF9500"
              stroke="#000"
              strokeWidth="4"
            />
            {/* Open Mouth Tongue */}
            <ellipse cx="100" cy="110" rx="6" ry="4" fill="#FF3366" />
          </g>
        ) : (
          // Happy smiling closed beak
          <path
            d="M 87 104 Q 100 97 113 104 Q 100 118 87 104 Z"
            fill="#FFA500"
            stroke="#000"
            strokeWidth="4"
          />
        )}

        {/* --- Dapper Red Operator Bowtie --- */}
        <g>
          {/* Left Knot */}
          <polygon
            points="100,136 84,128 84,144"
            fill="#FF3366"
            stroke="#000"
            strokeWidth="3"
          />
          {/* Right Knot */}
          <polygon
            points="100,136 116,128 116,144"
            fill="#FF3366"
            stroke="#000"
            strokeWidth="3"
          />
          {/* Center Knot */}
          <circle cx="100" cy="136" r="4.5" fill="#FFE53B" stroke="#000" strokeWidth="2.5" />
        </g>

        {/* --- Big Chunky Yellow Operator Headphones --- */}
        {/* Left Earcup */}
        <rect
          x="34"
          y="84"
          width="16"
          height="34"
          rx="7"
          fill="url(#earcupGrad)"
          stroke="#000"
          strokeWidth="4"
        />
        <line x1="42" y1="92" x2="42" y2="110" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />

        {/* Right Earcup */}
        <rect
          x="150"
          y="84"
          width="16"
          height="34"
          rx="7"
          fill="url(#earcupGrad)"
          stroke="#000"
          strokeWidth="4"
        />
        <line x1="158" y1="92" x2="158" y2="110" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />

        {/* --- Boom Microphone Arm & Capsule --- */}
        <path
          d="M 44 110 Q 56 138 90 125"
          fill="none"
          stroke="#000"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Mic Capsule */}
        <ellipse
          cx="92"
          cy="124"
          rx="7"
          ry="6"
          fill={isConnected ? '#A6FF00' : '#111'}
          stroke="#000"
          strokeWidth="3"
        />
        {/* Red Live Recording Indicator Dot on Mic */}
        <circle
          cx="92"
          cy="124"
          r="2.5"
          fill={isConnected || isConnecting ? '#FF3366' : '#777'}
          className={isConnected ? 'animate-ping' : ''}
        />

        {/* Small feet at bottom */}
        <ellipse cx="82" cy="178" rx="14" ry="7" fill="#FFA500" stroke="#000" strokeWidth="3.5" />
        <ellipse cx="118" cy="178" rx="14" ry="7" fill="#FFA500" stroke="#000" strokeWidth="3.5" />
      </svg>
    </motion.div>
  )
}

function App() {
  // CRITICAL RULE: Exact underlying state variables and AssemblyAI hook wired to backend
  const { status, transcript, start, stop, errorMessage } = useVoiceAgent()
  const [snapshot, setSnapshot] = useState({
    total_customers: 35,
    total_orders: 518,
    total_revenue: 12251.1,
    overdue_payment_count: 47,
    overdue_payment_total: 1219.85,
  })
  const [bestSellers, setBestSellers] = useState([
    { product_id: 1, product_name: 'Red Miso Ramen', total_quantity_sold: 220 },
    { product_id: 3, product_name: 'Chicken Ramen', total_quantity_sold: 207 },
    { product_id: 2, product_name: 'White Miso Ramen', total_quantity_sold: 107 },
    { product_id: 4, product_name: 'Beef Curry Ramen', total_quantity_sold: 106 },
    { product_id: 8, product_name: 'Takoyaki', total_quantity_sold: 78 },
  ])
  const [overdue, setOverdue] = useState([])
  const [activity, setActivity] = useState([])
  const [isStartled, setIsStartled] = useState(false)
  const [forceCanvasView, setForceCanvasView] = useState(false)

  // Resilient dashboard refresh logic with individual endpoint isolation
  const refreshDashboard = useCallback(async () => {
    const fetchJson = async (endpoint, fallback) => {
      try {
        const res = await fetch(`${BACKEND_URL}${endpoint}`)
        if (!res.ok) return fallback
        return await res.json()
      } catch {
        return fallback
      }
    }

    try {
      const [s, b, o, a] = await Promise.all([
        fetchJson('/tools/business_snapshot', null),
        fetchJson('/tools/best_sellers?limit=5', null),
        fetchJson('/tools/overdue_payments', null),
        fetchJson('/tools/activity_log?limit=10', null),
      ])

      if (s && s.total_revenue !== undefined) {
        setSnapshot(s)
      }
      if (b?.best_sellers && Array.isArray(b.best_sellers)) {
        setBestSellers(b.best_sellers)
      }
      if (o?.overdue_payments && Array.isArray(o.overdue_payments)) {
        setOverdue(o.overdue_payments)
      }
      if (a?.activity_log && Array.isArray(a.activity_log)) {
        setActivity(a.activity_log)
      }
    } catch (err) {
      console.warn('Dashboard refresh handled gracefully:', err)
    }
  }, [])

 useEffect(() => {
  refreshDashboard()
}, [refreshDashboard])

  // Auto-refresh after any tool call, so write actions immediately reflect in UI
  useEffect(() => {
  const last = transcript[transcript.length - 1]
  if (last?.who === 'tool') refreshDashboard()
  if (last?.who === 'agent') {
    const text = last.text?.toLowerCase() || ''
    const endPhrases = ['goodbye', 'have a great day', 'take care', 'end call', 'talk soon']
    if (endPhrases.some(phrase => text.includes(phrase))) {
      setTimeout(() => stop(), 1500)
    }
  }
}, [transcript, refreshDashboard, stop])

  const isActive =
    status === 'connected' ||
    status === 'listening' ||
    status === 'speaking' ||
    status === 'connecting'

  // Show open canvas if active call or user explicitly opened data canvas
  const showCanvas = isActive || forceCanvasView

  const handleTalkClick = () => {
    setIsStartled(true)
    setTimeout(() => setIsStartled(false), 800)
    if (isActive) {
      stop()
    } else {
      start()
    }
  }

  return (
    <div className="min-h-screen bg-[#FFE53B] text-black font-sans selection:bg-black selection:text-[#FFE53B] relative overflow-x-hidden">
      {/* ========================================================================= */}
      {/* GLOBAL TOP BAR                                                            */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FFE53B] border-b-4 border-black px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#FFE53B] border-2 border-black shadow-[3px_3px_0px_#000] rounded-xl flex items-center justify-center font-black text-xl select-none">
              VO
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tighter uppercase">VoiceOps</span>
                <span className="bg-[#A6FF00] border-2 border-black text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-[2px_2px_0px_#000]">
                  AssemblyAI Live
                </span>
              </div>
              <p className="text-xs font-bold text-neutral-800 -mt-1 hidden sm:block">
                Tactile Autonomous Voice Operator · Chicago Ramen Mundelein
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Canvas Toggle when Idle */}
            {!isActive && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setForceCanvasView((prev) => !prev)}
                className="hidden sm:inline-flex items-center gap-2 bg-white border-3 border-black px-3 py-1.5 rounded-xl shadow-[3px_3px_0px_#000] font-black text-xs uppercase cursor-pointer hover:bg-neutral-100"
              >
                <span>{forceCanvasView ? '🎯 Focus Hero' : '📊 View Widgets'}</span>
              </motion.button>
            )}

            {/* Connection Status Badge */}
            <div className="flex items-center gap-2 bg-white border-3 border-black px-3.5 py-1.5 rounded-xl shadow-[3px_3px_0px_#000]">
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 border-black ${
                  status === 'connected' || status === 'listening'
                    ? 'bg-[#A6FF00] animate-ping'
                    : status === 'speaking'
                    ? 'bg-[#00D2FF] animate-bounce'
                    : status === 'error'
                    ? 'bg-[#FF3366]'
                    : status === 'connecting'
                    ? 'bg-[#FFE53B] animate-spin'
                    : 'bg-neutral-300'
                }`}
              />
              <span className="text-xs font-black uppercase tracking-wider">{status}</span>
            </div>

            {/* Manual Sync Button */}
            <motion.button
              onClick={refreshDashboard}
              whileTap={{ scale: 0.9, rotate: 180 }}
              title="Refresh Data"
              className="w-10 h-10 bg-white border-3 border-black rounded-xl shadow-[3px_3px_0px_#000] flex items-center justify-center font-bold text-lg hover:bg-neutral-100 cursor-pointer"
            >
              ↻
            </motion.button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. HERO STATE: Massive Circular "Talk" Button with Penguin Portrait       */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait">
        {!showCanvas && (
          <motion.div
            key="hero-stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none"
          >
            {/* Neubrutalist Maximalist Background Stickers */}
            <motion.div
              initial={{ rotate: -12, scale: 0 }}
              animate={{ rotate: -8, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="absolute top-12 left-6 sm:left-16 bg-[#00D2FF] border-3 border-black px-4 py-2 rounded-2xl shadow-[4px_4px_0px_#000] hidden md:block"
            >
              <p className="text-xs font-black uppercase tracking-wider">🎙️ ZERO CLICKS</p>
              <p className="text-[10px] font-bold text-neutral-800">AssemblyAI Realtime Engine</p>
            </motion.div>

            <motion.div
              initial={{ rotate: 12, scale: 0 }}
              animate={{ rotate: 8, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="absolute top-16 right-6 sm:right-16 bg-[#A6FF00] border-3 border-black px-4 py-2 rounded-2xl shadow-[4px_4px_0px_#000] hidden md:block"
            >
              <p className="text-xs font-black uppercase tracking-wider">⚡ LIVE AGENT READY</p>
              <p className="text-[10px] font-bold text-neutral-800">Postgres + Tool Execution</p>
            </motion.div>

            <motion.div
              initial={{ rotate: -6, scale: 0 }}
              animate={{ rotate: -4, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute bottom-16 left-8 sm:left-24 bg-[#FF5E36] text-white border-3 border-black px-4 py-2 rounded-2xl shadow-[4px_4px_0px_#000] hidden lg:block"
            >
              <p className="text-xs font-black uppercase tracking-wider">🐧 PEN-G HOST</p>
              <p className="text-[10px] font-bold opacity-90">Autonomous Voice Operator</p>
            </motion.div>

            {/* Center Hero Heading */}
            <div className="text-center max-w-2xl mx-auto mb-6 space-y-2">
              <div className="inline-flex items-center gap-2 bg-white border-3 border-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_#000]">
                <span>●</span> READY TO LISTEN
              </div>
              <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight leading-[0.9]">
                PRESS TO{' '}
                <span className="bg-[#A6FF00] px-3 py-0.5 border-4 border-black inline-block -rotate-2 shadow-[6px_6px_0px_#000]">
                  TALK.
                </span>
              </h1>
              <p className="text-sm sm:text-base font-bold text-neutral-800 max-w-md mx-auto">
                Click the circular button to start talking to Pen-G, your restaurant's autonomous voice manager.
              </p>
            </div>

            {/* ========================================================================= */}
            {/* 2. THE PHYSICAL CLICK: Massive Circular Button (w-64 h-64 / w-72 h-72)    */}
            {/* ========================================================================= */}
            <div className="relative my-2">
              {/* Outer pulsing energy ring */}
              <div className="absolute inset-0 rounded-full bg-black/10 scale-110 pointer-events-none animate-pulse" />

              <motion.button
                onClick={handleTalkClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{
                  x: 8,
                  y: 8,
                  boxShadow: '0px 0px 0px rgba(0,0,0,1)',
                }}
                transition={{ type: 'spring', stiffness: 450, damping: 17 }}
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)] relative flex flex-col items-center justify-center cursor-pointer group select-none overflow-hidden focus:outline-none"
              >
                {/* Top Badge on Button */}
                <div className="absolute top-4 bg-[#FFE53B] border-2 border-black text-[11px] font-black uppercase px-3 py-0.5 rounded-full shadow-[2px_2px_0px_#000] z-10">
                  {status === 'idle' ? 'START TALKING' : status.toUpperCase()}
                </div>

                {/* Illustrated Neubrutalist 2D Penguin Portrait (Never Blank!) */}
                <div className="mt-2">
                  <PenguinPortrait status={status} isStartled={isStartled} size="lg" />
                </div>

                {/* Bottom Callout in Button */}
                <div className="absolute bottom-4 bg-black text-[#FFE53B] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full group-hover:bg-[#FF5E36] group-hover:text-white transition-colors">
                  {isActive ? 'CLICK TO END' : status === 'error' ? 'CLICK TO RETRY' : 'CLICK TO CONNECT'}
                </div>
              </motion.button>
            </div>

            {/* Error Banner if mic/websocket error */}
            {(status === 'error' || errorMessage) && (
              <div className="mt-4 bg-[#FF3366] text-white border-3 border-black px-4 py-2 rounded-2xl shadow-[4px_4px_0px_#000] text-center max-w-md">
                <p className="text-xs font-black uppercase tracking-wide">
                  ⚠️ {errorMessage || 'Could not establish voice connection.'}
                </p>
                <button
                  onClick={handleTalkClick}
                  className="mt-2 bg-white text-black border-2 border-black px-3 py-1 rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#000] hover:bg-neutral-100 cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            )}

            {/* Quick-Prompt Suggestions Below Hero Button */}
            <div className="mt-8 text-center max-w-xl">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-700 mb-3">
                Try asking aloud when connected:
              </p>
              <div className="flex flex-wrap justify-center gap-2.5 text-xs font-black">
                <span className="bg-white border-2 border-black px-3.5 py-1.5 rounded-xl shadow-[2px_2px_0px_#000] -rotate-1">
                  "What are today's total sales?"
                </span>
                <span className="bg-white border-2 border-black px-3.5 py-1.5 rounded-xl shadow-[2px_2px_0px_#000] rotate-1">
                  "Who has overdue tabs?"
                </span>
                <span className="bg-white border-2 border-black px-3.5 py-1.5 rounded-xl shadow-[2px_2px_0px_#000] -rotate-1">
                  "What is our #1 best seller?"
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. THE CANVAS REVEAL: Floating Spring Widget Cards (No Transcribe Section) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showCanvas && (
          <motion.main
            key="canvas-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 py-8 sm:px-8 pb-36 space-y-8"
          >
            {/* Canvas Header Banner */}
            <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#A6FF00] border-2 border-black px-2.5 py-0.5 rounded font-black text-xs uppercase shadow-[2px_2px_0px_#000]">
                    Live Canvas
                  </span>
                  <span className="text-xs font-bold text-neutral-600">
                    Auto-updating with live voice commands
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                  Autonomous Operations Dashboard
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForceCanvasView(false)}
                  className="bg-[#FFE53B] border-3 border-black px-4 py-2 rounded-xl font-black text-xs uppercase shadow-[3px_3px_0px_#000] hover:bg-[#ffe01a] cursor-pointer"
                >
                  Return to Hero
                </button>
                <button
                  onClick={stop}
                  className="bg-[#FF3366] text-white border-3 border-black px-4 py-2 rounded-xl font-black text-xs uppercase shadow-[3px_3px_0px_#000] hover:bg-[#e62053] cursor-pointer"
                >
                  End Call
                </button>
              </div>
            </div>

            {/* SPRUNG WIDGET CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* WIDGET 1: TIGER MASCOT + BUSINESS SNAPSHOT */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.05 }}
                className="md:col-span-12 bg-white border-4 border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b-3 border-black">
                  <div className="flex items-center gap-4">
                    <MascotPlaceholder mascot="tiger" size="md" />
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                        Financial Overview
                      </span>
                      <h3 className="text-2xl font-black uppercase tracking-tight">
                        Business Snapshot
                      </h3>
                    </div>
                  </div>

                  <div className="bg-[#FFE53B] border-2 border-black px-3 py-1 rounded-lg text-xs font-black shadow-[2px_2px_0px_#000]">
                    Chicago Ramen Mundelein
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#FFFDF7] border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000]">
                    <p className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-1">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-black tracking-tight text-black">
                      {snapshot ? `$${snapshot.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </p>
                    <div className="mt-2 text-[10px] font-black uppercase text-[#FF5E36]">
                      ● Verified gross sales
                    </div>
                  </div>

                  <div className="bg-[#FFFDF7] border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000]">
                    <p className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-1">
                      Total Customers
                    </p>
                    <p className="text-3xl font-black tracking-tight">{snapshot?.total_customers ?? '—'}</p>
                    <div className="mt-2 text-[10px] font-black uppercase text-neutral-600">Active roster</div>
                  </div>

                  <div className="bg-[#FFFDF7] border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000]">
                    <p className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-1">
                      Total Orders
                    </p>
                    <p className="text-3xl font-black tracking-tight">{snapshot?.total_orders ?? '—'}</p>
                    <div className="mt-2 text-[10px] font-black uppercase text-[#A6FF00] bg-black px-1.5 py-0.5 rounded inline-block">
                      Fulfilled
                    </div>
                  </div>

                  <div className="bg-[#FFFDF7] border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000]">
                    <p className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-1">
                      Overdue Tabs
                    </p>
                    <p className="text-3xl font-black tracking-tight text-[#FF3366]">
                      {snapshot?.overdue_payment_count ?? '—'}
                    </p>
                    <div className="mt-2 text-[10px] font-black uppercase text-[#FF3366]">
                      {snapshot?.overdue_payment_total ? `$${Number(snapshot.overdue_payment_total).toFixed(2)} total` : 'Needs action'}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* WIDGET 2: FOX MASCOT + BEST SELLERS */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.12 }}
                className="md:col-span-6 bg-white border-4 border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b-3 border-black">
                    <div className="flex items-center gap-3">
                      <MascotPlaceholder mascot="fox" size="md" />
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                          Menu Velocity
                        </span>
                        <h3 className="text-xl font-black uppercase tracking-tight">Best Sellers</h3>
                      </div>
                    </div>

                    <span className="bg-[#A6FF00] border-2 border-black px-2.5 py-1 rounded text-xs font-black uppercase shadow-[2px_2px_0px_#000]">
                      Top 5
                    </span>
                  </div>

                  <div className="space-y-3">
                    {bestSellers.length === 0 ? (
                      <p className="text-sm font-bold text-neutral-500 py-6 text-center">
                        Loading best sellers from menu orders...
                      </p>
                    ) : (
                      bestSellers.map((item, idx) => (
                        <div
                          key={item.product_id || idx}
                          className="bg-[#FFFDF7] border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_#000] flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-black text-[#FFE53B] font-black text-xs flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="font-black text-sm uppercase tracking-tight">
                              {item.product_name}
                            </span>
                          </div>
                          <div className="bg-[#FFE53B] border-2 border-black px-2.5 py-0.5 rounded font-black text-xs">
                            {item.total_quantity_sold} sold
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-neutral-200 text-xs font-bold text-neutral-600 flex justify-between">
                  <span>Auto-computed by quantity</span>
                  <span className="font-mono">RANKED #1-5</span>
                </div>
              </motion.div>

              {/* WIDGET 3: ELEPHANT MASCOT + OVERDUE PAYMENTS */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.18 }}
                className="md:col-span-6 bg-white border-4 border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b-3 border-black">
                    <div className="flex items-center gap-3">
                      <MascotPlaceholder mascot="elephant" size="md" />
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                          Cashflow Guard
                        </span>
                        <h3 className="text-xl font-black uppercase tracking-tight">Overdue Tabs</h3>
                      </div>
                    </div>

                    <span className="bg-[#FF3366] text-white border-2 border-black px-2.5 py-1 rounded text-xs font-black uppercase shadow-[2px_2px_0px_#000]">
                      Action Required
                    </span>
                  </div>

                  <div className="space-y-3">
                    {overdue.length === 0 ? (
                      <div className="p-6 bg-[#A6FF00] border-2 border-black rounded-xl text-center font-black text-sm">
                        ✨ Great news! All customer payments are up to date!
                      </div>
                    ) : (
                      overdue.map((p) => (
                        <div
                          key={p.payment_id}
                          className="bg-[#FFFDF7] border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_#000] flex items-center justify-between gap-3"
                        >
                          <div>
                            <p className="font-black text-sm uppercase">{p.customer_name}</p>
                            <p className="text-[11px] font-bold text-neutral-500">
                              Due: {p.due_date || 'Past Due'} · Order #{p.order_id}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block bg-[#FF3366] text-white border-2 border-black px-2.5 py-0.5 rounded font-black text-xs shadow-[2px_2px_0px_#000]">
                              ${Number(p.amount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-neutral-200 text-xs font-bold text-neutral-600 flex justify-between">
                  <span>Ask: "Send reminder for Anthony Taylor"</span>
                  <span className="font-mono text-[#FF3366]">UNCOLLECTED DEBT</span>
                </div>
              </motion.div>

              {/* WIDGET 4: SYSTEM AUDIT & ACTIVITY LOG */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.24 }}
                className="md:col-span-12 bg-white border-4 border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6"
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b-3 border-black">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFE53B] border-3 border-black rounded-xl shadow-[3px_3px_0px_#000] flex items-center justify-center font-black text-lg">
                      ⚡
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                        System Audit Trail
                      </span>
                      <h3 className="text-xl font-black uppercase tracking-tight">
                        Recent Voice & Tool Events
                      </h3>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold bg-neutral-100 border-2 border-black px-2 py-1 rounded">
                    {activity.length} Entries Recorded
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activity.length === 0 ? (
                    <p className="text-xs font-bold text-neutral-500 col-span-full py-4 text-center">
                      No recent activity logged.
                    </p>
                  ) : (
                    activity.map((act) => (
                      <div
                        key={act.id}
                        className="bg-[#FFFDF7] border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_#000] flex flex-col justify-between"
                      >
                        <p className="text-xs font-bold text-neutral-800 mb-2 leading-relaxed">
                          {act.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-neutral-500 pt-2 border-t border-neutral-200">
                          <span className="bg-neutral-200 px-1.5 py-0.5 rounded border border-black">
                            {act.action_type || 'action'}
                          </span>
                          <span>
                            {act.created_at ? new Date(act.created_at).toLocaleTimeString() : 'Just now'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. DOCKED MIC TOGGLE (When Active / In Canvas View)                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showCanvas && (
          <motion.div
            key="docked-mic-pill"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white border-4 border-black rounded-full px-5 py-2.5 shadow-[6px_6px_0px_#000]"
          >
            {/* Status indicator */}
            <div className="flex items-center gap-2 pr-2 border-r-2 border-neutral-300">
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 border-black ${
                  status === 'speaking'
                    ? 'bg-[#00D2FF] animate-bounce'
                    : status === 'listening'
                    ? 'bg-[#A6FF00] animate-ping'
                    : 'bg-[#FFE53B]'
                }`}
              />
              <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">
                {status === 'speaking' ? 'Pen-G Speaking' : status === 'listening' ? 'Listening...' : status}
              </span>
            </div>

            {/* Tactile Mini Circular Penguin Mic Button */}
            <motion.button
              onClick={handleTalkClick}
              whileHover={{ scale: 1.08 }}
              whileTap={{
                x: 4,
                y: 4,
                boxShadow: '0px 0px 0px rgba(0,0,0,1)',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center relative overflow-hidden cursor-pointer ${
                isActive ? 'bg-[#FF3366]' : 'bg-[#A6FF00]'
              }`}
              title={isActive ? 'Click to End Call' : 'Click to Talk'}
            >
              <div className="w-12 h-12 pointer-events-none flex items-center justify-center">
                <PenguinPortrait status={status} isStartled={false} size="sm" />
              </div>
            </motion.button>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 pl-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stop}
                className="bg-neutral-100 hover:bg-neutral-200 border-2 border-black rounded-xl px-3 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000]"
              >
                End Call
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
