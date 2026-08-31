import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer
      dir="rtl"
      className="border-t border-stone-200 bg-white"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-2">
        {/* צד ימין */}
        <div className="text-right md:col-start-2 md:row-start-1">
          <div className="flex items-center gap-3">
  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-sm font-bold text-white">
    EA
  </div>

  <div>
    <h2 className="text-xl font-bold">
      {SITE_NAME}
    </h2>

    <p className="text-xs text-stone-500">
      נגרות בהתאמה אישית
    </p>
  </div>
</div>

          <p className="mt-3 max-w-md text-sm leading-6 text-stone-500">
            עבודות נגרות בהתאמה אישית,
            משלב התכנון ועד לייצור ולהתקנה.
          </p>
        </div>

        {/* צד שמאל */}
        <nav className="flex flex-wrap gap-x-8 gap-y-4 text-right md:col-start-1 md:row-start-1 md:justify-start">
          <Link
            href="/"
            className="transition hover:text-amber-700"
          >
            בית
          </Link>

          <Link
            href="/projects"
            className="transition hover:text-amber-700"
          >
            עבודות
          </Link>

          <Link
            href="/about"
            className="transition hover:text-amber-700"
          >
            אודות
          </Link>

          <Link
            href="/contact"
            className="transition hover:text-amber-700"
          >
            צור קשר
          </Link>
        </nav>
      </div>

      <div className="border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-6 py-6 text-right text-sm text-stone-500">
          © 2026 {SITE_NAME}. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
}