"use client";

import { useSyncExternalStore } from "react";
import GlowCursor from "@/components/reactbits/GlowCursor";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Full-page glowing light that follows the mouse. Click-through, drawn above
 * the page content but below the header. Skipped on touch screens.
 */
export function CursorGlow() {
  const hasMouse = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  if (!hasMouse) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <GlowCursor
        color="#8b7bff"
        secondaryColor="#22d3ee"
        intensity={0.75}
        glow={1}
        trailWidth={2.2}
        linger={1.2}
        quality="medium"
      />
    </div>
  );
}
