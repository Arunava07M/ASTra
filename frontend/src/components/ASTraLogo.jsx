export default function ASTraLogo({ className = "w-8 h-8" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      stroke="#34d399"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Left leg */}
      <path d="M16 6 L8 24" />
      {/* Right leg */}
      <path d="M16 6 L24 24" />
      {/* Middle crossing bar to make the 'A' */}
      <path d="M11.5 16 L20.5 16" />
      
      {/* Three simple node circles */}
      <circle cx="16" cy="6" r="3" fill="#34d399" />
      <circle cx="8" cy="24" r="3" fill="#34d399" />
      <circle cx="24" cy="24" r="3" fill="#34d399" />
    </svg>
  );
}