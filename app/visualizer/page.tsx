import type { Metadata } from "next";

import MaterialVisualizer from "@/components/MaterialVisualizer";

export const metadata: Metadata = {
  title: "שילוב צבעים וחומרים",
  description:
    "כלי להמחשת שילובים בין סוגי עץ, צבעים ופרזול לעבודות נגרות בהתאמה אישית.",
};

export default function VisualizerPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f4f0]">
      <MaterialVisualizer />
    </main>
  );
}
