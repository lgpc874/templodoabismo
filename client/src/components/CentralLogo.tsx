export function CentralLogo() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
      <div className="animate-spin-slow-reverse">
        <svg 
          width="256" 
          height="256" 
          viewBox="0 0 256 256" 
          className="w-48 h-48 md:w-64 md:h-64 opacity-10 drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="sealGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(251, 191, 36, 0.8)" />
              <stop offset="100%" stopColor="rgba(239, 68, 68, 0.4)" />
            </radialGradient>
          </defs>
          
          {/* Círculo exterior */}
          <circle cx="128" cy="128" r="120" fill="none" stroke="url(#sealGradient)" strokeWidth="2"/>
          
          {/* Pentagrama invertido */}
          <path d="M128 40 L158 96 L218 96 L174 132 L190 188 L128 156 L66 188 L82 132 L38 96 L98 96 Z" 
                fill="none" stroke="url(#sealGradient)" strokeWidth="3"/>
          
          {/* Círculo central */}
          <circle cx="128" cy="128" r="25" fill="none" stroke="url(#sealGradient)" strokeWidth="2"/>
          
          {/* Símbolos místicos ao redor */}
          <text x="128" y="25" textAnchor="middle" className="fill-current text-amber-400 text-lg font-fell">⸸</text>
          <text x="220" y="135" textAnchor="middle" className="fill-current text-amber-400 text-lg font-fell">☾</text>
          <text x="128" y="245" textAnchor="middle" className="fill-current text-amber-400 text-lg font-fell">𖤍</text>
          <text x="36" y="135" textAnchor="middle" className="fill-current text-amber-400 text-lg font-fell">☿</text>
        </svg>
      </div>
    </div>
  );
}