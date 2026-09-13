"use client";

type PageTransitionProps = {
  active: boolean;
};

export default function PageTransition({ active }: PageTransitionProps) {
  return (
    <div
      aria-hidden={!active}
      className={`fixed inset-0 z-[9998] flex items-center justify-center bg-[#171512]/88 backdrop-blur-sm transition-opacity duration-200 ${
        active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative flex h-[210px] w-[280px] items-center justify-center">
        <div className="absolute bottom-[42px] h-[34px] w-[210px] rounded-[10px] bg-[#9c6840] shadow-[inset_0_5px_0_rgba(255,255,255,0.08),0_14px_40px_rgba(0,0,0,0.28)]">
          <div className="absolute inset-x-4 top-[10px] h-px bg-black/15" />
          <div className="absolute inset-x-8 top-[20px] h-px bg-white/10" />
        </div>

        <div className="nail absolute bottom-[70px] left-1/2 h-[54px] w-[5px] -translate-x-1/2 rounded-full bg-zinc-300 shadow-md">
          <div className="absolute -left-[5px] top-0 h-[5px] w-[15px] rounded-full bg-zinc-200" />
        </div>

        <div className="hammer absolute left-1/2 top-[22px] h-[110px] w-[120px] origin-[74px_92px]">
          <div className="absolute left-[67px] top-[34px] h-[78px] w-[11px] rotate-[24deg] rounded-full bg-[#b77745] shadow-md" />
          <div className="absolute left-[28px] top-[19px] h-[28px] w-[72px] rounded-[8px] bg-zinc-300 shadow-[inset_0_3px_0_rgba(255,255,255,0.35),0_5px_12px_rgba(0,0,0,0.25)]">
            <div className="absolute -left-[17px] top-[6px] h-[16px] w-[24px] rounded-l-[8px] bg-zinc-400" />
          </div>
        </div>

        <p className="absolute bottom-0 text-sm font-medium tracking-[0.18em] text-[#ead7bd]">
          בונים את העמוד...
        </p>
      </div>

      <style jsx>{`
        .hammer {
          animation: hammer-strike 0.52s ease-in-out infinite;
        }

        .nail {
          animation: nail-down 0.52s ease-in-out infinite;
        }

        @keyframes hammer-strike {
          0% {
            transform: translateX(-50%) rotate(-27deg);
          }
          38% {
            transform: translateX(-50%) rotate(7deg);
          }
          48% {
            transform: translateX(-50%) rotate(12deg);
          }
          68% {
            transform: translateX(-50%) rotate(-10deg);
          }
          100% {
            transform: translateX(-50%) rotate(-27deg);
          }
        }

        @keyframes nail-down {
          0%,
          36% {
            transform: translateX(-50%) translateY(0);
          }
          48%,
          100% {
            transform: translateX(-50%) translateY(7px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hammer,
          .nail {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
