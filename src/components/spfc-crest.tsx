import Image from "next/image";

export function SpfcCrest({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
      {/* Dark Mode: Logo oficial sem contorno preto externo para fundos escuros */}
      <Image
        src="/spfc-logo.png"
        alt="São Paulo FC"
        width={40}
        height={40}
        priority
        className="hidden dark:block w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(211,21,27,0.25)]"
      />
      {/* Light Mode: Logo oficial com contorno preto para fundos claros */}
      <Image
        src="/spfc-logo-outline.png"
        alt="São Paulo FC"
        width={40}
        height={40}
        priority
        className="block dark:hidden w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
      />
    </div>
  );
}
