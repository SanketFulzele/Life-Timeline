"use client";

import DotGrid from "@/components/reactbits/DotGrid";

/**
 * Full-page dot grid behind the landing page. Dots are dim until the cursor
 * comes near, then nudge aside and light up violet to match the glow cursor.
 * The solid backdrop hides the site-wide square grid lines behind it.
 */
export function DotBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 bg-[#07070a]">
      <DotGrid
        dotSize={3}
        gap={24}
        baseColor="#3a3548"
        activeColor="#a99cff"
        proximity={130}
        strength={0.5}
        bounce={0.4}
        swell={0.6}
        stretch={0.3}
        glow={0.6}
        shockRadius={240}
        shockStrength={2.5}
        fade={0.25}
      />
    </div>
  );
}
