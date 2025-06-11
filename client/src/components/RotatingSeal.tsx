interface RotatingSealProps {
  variant?: 'simple' | 'complex' | 'mystical';
  opacity?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function RotatingSeal({ 
  variant = 'simple', 
  opacity = 8,
  size = 'md'
}: RotatingSealProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-48 h-48';
      case 'md': return 'w-64 h-64';
      case 'lg': return 'w-80 h-80';
      case 'xl': return 'w-96 h-96';
      default: return 'w-64 h-64';
    }
  };

  const getOpacityClass = () => `opacity-${opacity}`;

  if (variant === 'simple') {
    return (
      <div className="fixed top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2" style={{marginTop: '2rem'}}>
        <div className={`rotating-seal ${getSizeClasses()} ${getOpacityClass()}`}>
          <img 
            src="/seal.png" 
            alt="Selo do Templo do Abismo" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>
    );
  }

  if (variant === 'complex') {
    return (
      <div className="fixed top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2" style={{marginTop: '2rem'}}>
        {/* Outer rotating ring */}
        <div className="absolute w-80 h-80 opacity-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow-reverse text-amber-500/15 text-[20rem] leading-none flex items-center justify-center h-full">
            ◯
          </div>
        </div>
        
        {/* Middle layer with mystical symbols */}
        <div className="absolute w-72 h-72 opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-400/20 text-[18rem] leading-none flex items-center justify-center h-full">
            ☿
          </div>
        </div>
        
        {/* Logo Central Rotativa */}
        <div className={`rotating-seal ${getSizeClasses()} ${getOpacityClass()}`}>
          <img 
            src="/seal.png" 
            alt="Selo do Templo do Abismo" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>
    );
  }

  if (variant === 'mystical') {
    return (
      <div className="fixed top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2" style={{marginTop: '2rem'}}>
        {/* Outer rotating ring */}
        <div className="absolute w-80 h-80 opacity-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow-reverse text-amber-500/15 text-[20rem] leading-none flex items-center justify-center h-full">
            ◯
          </div>
        </div>
        
        {/* Middle layer with mystical symbols */}
        <div className="absolute w-72 h-72 opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-400/20 text-[18rem] leading-none flex items-center justify-center h-full">
            ☿
          </div>
        </div>
        
        {/* Main central seal */}
        <div className="rotating-seal absolute w-64 h-64 opacity-15 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-500/30 text-[16rem] leading-none flex items-center justify-center h-full">
            ⸸
          </div>
        </div>
        
        {/* Inner pulsing core */}
        <div className="absolute w-16 h-16 opacity-25 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-red-300/40 text-4xl leading-none flex items-center justify-center h-full">
            ●
          </div>
        </div>
      </div>
    );
  }

  return null;
}