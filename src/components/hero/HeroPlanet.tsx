"use client";

import { RingShowcase } from "@/components/ring/RingShowcase";

export function HeroPlanet() {
  return (
    <RingShowcase
      className="max-w-[620px]"
      frameClassName="overflow-visible"
      ringScale={0.46}
    />
  );
}
