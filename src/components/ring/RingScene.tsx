"use client";

import { useThree } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { sceneConfig } from "@/config/scene";
import type { RingInteractionState } from "./ring.types";
import { RingAura } from "./RingAura";
import { RingEnvironment } from "./RingEnvironment";
import { RingLighting } from "./RingLighting";
import { RingModel } from "./RingModel";

type RingSceneProps = {
  interactionRef: MutableRefObject<RingInteractionState>;
  reducedMotion: boolean;
  ringScale: number;
};

export function RingScene({
  interactionRef,
  reducedMotion,
  ringScale,
}: RingSceneProps) {
  const { size } = useThree();
  const mobile = size.width < sceneConfig.mobileBreakpoint;

  return (
    <>
      <RingEnvironment mobile={mobile} />
      <RingLighting />
      <RingAura
        interactionRef={interactionRef}
        mobile={mobile}
        reducedMotion={reducedMotion}
        ringScale={ringScale}
      />
      <RingModel
        interactionRef={interactionRef}
        mobile={mobile}
        reducedMotion={reducedMotion}
        ringScale={ringScale}
      />
    </>
  );
}
