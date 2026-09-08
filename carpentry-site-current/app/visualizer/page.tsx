import type { Metadata } from "next";
import Image from "next/image";

import MaterialVisualizer from "@/components/MaterialVisualizer";

export const metadata: Metadata = {
  title: "הדמיית חומרים וצבעים",
  description:
    "התנסו בשילובים של סוגי עץ, צבעים, חזיתות, ידיות וסביבת החדר לפני שמתחילים לתכנן את עבודת הנגרות.",
  alternates: {
    canonical: "/visualizer",
  },
  openGraph: {
    title: "הדמיית חומרים וצבעים | נגריית עימאד אקרם",
    description:
      "כלי אינטראקטיבי להמחשת שילובי עץ, צבעים ופרטי נגרות.",
    url: "/visualizer",
  },
};

export default function VisualizerPage() {
  return (
    <main dir="rtl" className="bg-[#faf9f6]">
      <section className="px-4 pt-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] border border-stone-200 shadow-sm">
          <div className="relative aspect-[16/9] w-full bg-stone-100 md:aspect-auto md:min-h-[560px]">
            <Image
              src="/visualizer-bg.png"
              alt="שילובי עץ, צבעים, חומרים ופרזול"
              fill
              priority
              sizes="100vw"
              className="object-contain md:object-cover"
            />
          </div>
        </div>
      </section>

      <MaterialVisualizer />
    </main>
  );
}
