export default function ASTraLogo({ className = "w-8 h-8" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="astra-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" /> 
          <stop offset="100%" stopColor="#22d3ee" /> 
        </linearGradient>
        <linearGradient id="debt-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f87171" /> 
          <stop offset="100%" stopColor="#fbbf24" /> 
        </linearGradient>
      </defs>

      <path d="M16 4 L6 26" stroke="url(#astra-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
      <path d="M16 4 L26 26" stroke="url(#astra-gradient)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 17 L22 17" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 12 L22 17" stroke="url(#astra-gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>

      <circle cx="16" cy="4" r="4" fill="#0f172a" stroke="url(#astra-gradient)" strokeWidth="2" />
      <circle cx="16" cy="4" r="1.5" fill="#34d399" />

      <circle cx="6" cy="26" r="3.5" fill="#0f172a" stroke="url(#astra-gradient)" strokeWidth="2" />

      <circle cx="16" cy="12" r="2.5" fill="#22d3ee" />

      <circle cx="26" cy="26" r="3.5" fill="#0f172a" stroke="url(#debt-gradient)" strokeWidth="2" />
      <circle cx="26" cy="26" r="1.5" fill="#fbbf24" />
    </svg>
  );
}