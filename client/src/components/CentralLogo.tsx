import temploLogo from "@assets/image_1749586190170.png";

export function CentralLogo() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
      <div className="animate-spin-slow-reverse">
        <img 
          src={temploLogo}
          alt="Templo do Abismo"
          className="w-48 h-48 md:w-64 md:h-64 opacity-10 drop-shadow-2xl"
        />
      </div>
    </div>
  );
}