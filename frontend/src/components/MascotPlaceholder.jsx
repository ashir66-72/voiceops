import React from 'react'

/**
 * MascotPlaceholder component
 * Specifically structured so the user can easily drop in custom 2D mascot images (Tiger, Squirrel, Elephant).
 * If no custom image is supplied, renders a high-character, neubrutalist 2D vector mascot.
 */
export function MascotPlaceholder({ mascot, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-28 h-28',
  }[size] || 'w-16 h-16'

  if (mascot === 'tiger') {
    return (
      <div
        data-mascot="tiger"
        className={`relative inline-flex items-center justify-center bg-[#FF9F1C] border-3 border-black shadow-[3px_3px_0px_#000] rounded-xl shrink-0 overflow-hidden ${sizeClasses} ${className}`}
        title="2D Mascot: Tiger"
      >
        {/* ======================================================== */}
        {/* [MASCOT PLACEHOLDER: TIGER]                              */}
        {/* Drop your custom 2D Tiger image here:                    */}
        {/* <img src="/path/to/tiger.png" alt="Tiger" className="w-full h-full object-contain" /> */}
        {/* ======================================================== */}
        <svg viewBox="0 0 64 64" fill="none" className="w-4/5 h-4/5">
          {/* Ears */}
          <circle cx="16" cy="18" r="8" fill="#E05700" stroke="#000" strokeWidth="2.5" />
          <circle cx="48" cy="18" r="8" fill="#E05700" stroke="#000" strokeWidth="2.5" />
          <circle cx="16" cy="18" r="4" fill="#FFEAA7" />
          <circle cx="48" cy="18" r="4" fill="#FFEAA7" />
          {/* Head */}
          <circle cx="32" cy="36" r="22" fill="#FFA502" stroke="#000" strokeWidth="3" />
          {/* Tiger Stripes */}
          <path d="M28 17 L32 23 L36 17" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M13 32 L20 34" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M51 32 L44 34" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 40 L19 41" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M52 40 L45 41" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          {/* Snout */}
          <ellipse cx="32" cy="42" rx="10" ry="7" fill="#FFEAA7" stroke="#000" strokeWidth="2" />
          <polygon points="32,38 28,34 36,34" fill="#000" />
          {/* Eyes */}
          <circle cx="23" cy="32" r="3.5" fill="#000" />
          <circle cx="41" cy="32" r="3.5" fill="#000" />
          <circle cx="22" cy="31" r="1.2" fill="#FFF" />
          <circle cx="40" cy="31" r="1.2" fill="#FFF" />
        </svg>
      </div>
    )
  }

  if (mascot === 'fox' || mascot === 'squirrel') {
    return (
      <div
        data-mascot="fox"
        className={`relative inline-flex items-center justify-center bg-[#FF5722] border-3 border-black shadow-[3px_3px_0px_#000] rounded-xl shrink-0 overflow-hidden ${sizeClasses} ${className}`}
        title="2D Mascot: Fox"
      >
        {/* ======================================================== */}
        {/* [MASCOT PLACEHOLDER: FOX]                                */}
        {/* Drop your custom 2D Fox image here:                      */}
        {/* <img src="/path/to/fox.png" alt="Fox" className="w-full h-full object-contain" /> */}
        {/* ======================================================== */}
        <svg viewBox="0 0 64 64" fill="none" className="w-4/5 h-4/5">
          {/* Pointy Fox Ears */}
          <polygon points="18,22 14,8 26,16" fill="#D84315" stroke="#000" strokeWidth="2.5" />
          <polygon points="18,18 16,11 23,16" fill="#FFF" />
          <polygon points="46,22 50,8 38,16" fill="#D84315" stroke="#000" strokeWidth="2.5" />
          <polygon points="46,18 48,11 41,16" fill="#FFF" />
          {/* Fox Head Base */}
          <ellipse cx="32" cy="34" rx="19" ry="17" fill="#FF5722" stroke="#000" strokeWidth="3" />
          {/* White Muzzle Cheeks */}
          <path d="M 14 36 C 14 46, 26 50, 32 46 C 38 50, 50 46, 50 36 C 44 32, 38 34, 32 37 C 26 34, 20 32, 14 36 Z" fill="#FFFDF7" stroke="#000" strokeWidth="2.5" />
          {/* Eyes */}
          <circle cx="23" cy="29" r="3.2" fill="#000" />
          <circle cx="41" cy="29" r="3.2" fill="#000" />
          <circle cx="22" cy="28" r="1.2" fill="#FFF" />
          <circle cx="40" cy="28" r="1.2" fill="#FFF" />
          {/* Cute Black Button Nose */}
          <polygon points="32,41 28,37 36,37" fill="#000" />
          {/* Whiskers */}
          <path d="M 18 40 L 10 39" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <path d="M 18 43 L 11 44" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <path d="M 46 40 L 54 39" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <path d="M 46 43 L 53 44" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  if (mascot === 'elephant') {
    return (
      <div
        data-mascot="elephant"
        className={`relative inline-flex items-center justify-center bg-[#4D96FF] border-3 border-black shadow-[3px_3px_0px_#000] rounded-xl shrink-0 overflow-hidden ${sizeClasses} ${className}`}
        title="2D Mascot: Elephant"
      >
        {/* ======================================================== */}
        {/* [MASCOT PLACEHOLDER: ELEPHANT]                           */}
        {/* Drop your custom 2D Elephant image here:                 */}
        {/* <img src="/path/to/elephant.png" alt="Elephant" className="w-full h-full object-contain" /> */}
        {/* ======================================================== */}
        <svg viewBox="0 0 64 64" fill="none" className="w-4/5 h-4/5">
          {/* Giant Ears */}
          <ellipse cx="14" cy="32" rx="10" ry="14" fill="#6BCB77" stroke="#000" strokeWidth="2.5" />
          <ellipse cx="50" cy="32" rx="10" ry="14" fill="#6BCB77" stroke="#000" strokeWidth="2.5" />
          <ellipse cx="14" cy="32" rx="6" ry="9" fill="#B4ECE3" />
          <ellipse cx="50" cy="32" rx="6" ry="9" fill="#B4ECE3" />
          {/* Head */}
          <circle cx="32" cy="32" r="18" fill="#74B9FF" stroke="#000" strokeWidth="3" />
          {/* Trunk */}
          <path
            d="M32 36 C32 46 24 50 20 46 C17 43 20 38 23 40"
            stroke="#000"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M32 36 C32 46 24 50 20 46 C17 43 20 38 23 40"
            stroke="#74B9FF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Eyes */}
          <circle cx="26" cy="27" r="3.2" fill="#000" />
          <circle cx="38" cy="27" r="3.2" fill="#000" />
          <circle cx="25" cy="26" r="1" fill="#FFF" />
          <circle cx="37" cy="26" r="1" fill="#FFF" />
        </svg>
      </div>
    )
  }

  return (
    <div
      data-mascot={mascot}
      className={`relative inline-flex items-center justify-center bg-yellow-300 border-3 border-black shadow-[3px_3px_0px_#000] rounded-xl shrink-0 overflow-hidden font-black text-sm uppercase ${sizeClasses} ${className}`}
    >
      {/* ======================================================== */}
      {/* [GENERIC MASCOT PLACEHOLDER: {mascot}]                    */}
      {/* Drop your custom 2D mascot image here                    */}
      {/* ======================================================== */}
      {mascot}
    </div>
  )
}
