"use client";

import Aurora from "@/components/reactbits/Aurora";

/** Soft animated glow behind the top of a page. Purely decorative. */
export function HeroAurora({ height = "h-[560px]", opacity = 0.7 }: { height?: string; opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 -z-10 ${height} [mask-image:linear-gradient(to_bottom,black_55%,transparent)]`}
    >
      <Aurora
        colorStops={["#4c3bd6", "#8b7bff", "#22d3ee"]}
        amplitude={1.1}
        height={0.42}
        glow={0.7}
        brightness={1}
        blend={0.6}
        speed={0.6}
        opacity={opacity}
        mouseInteraction={false}
      />
    </div>
  );
}
