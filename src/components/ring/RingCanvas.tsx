"use client";

import { Suspense, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { sceneConfig } from "@/config/scene";
import type { RingInteractionState } from "./ring.types";
import { RingScene } from "./RingScene";

type RingCanvasProps = {
  interactionRef: MutableRefObject<RingInteractionState>;
  reducedMotion: boolean;
  ringScale: number;
};

export function RingCanvas({
  interactionRef,
  reducedMotion,
  ringScale,
}: RingCanvasProps) {
  return (
    <Canvas
      camera={sceneConfig.camera}
      className="absolute inset-0"
      dpr={sceneConfig.canvas.dpr}
      frameloop="always"
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      shadows
      onCreated={({ gl }) => {
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.5;
        gl.setClearAlpha(0);
      }}
    >
      <Suspense fallback={null}>
        <RingScene
          interactionRef={interactionRef}
          reducedMotion={reducedMotion}
          ringScale={ringScale}
        />
      </Suspense>
    </Canvas>
  );
}
