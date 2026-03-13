"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { ringConfig } from "@/config/ring";
import { damp } from "@/lib/utils";
import type { RingInteractionState } from "./ring.types";

type RingAuraProps = {
  interactionRef: MutableRefObject<RingInteractionState>;
  mobile: boolean;
  reducedMotion: boolean;
  ringScale: number;
};

export function RingAura({
  interactionRef,
  mobile,
  reducedMotion,
  ringScale,
}: RingAuraProps) {
  const primaryRef = useRef<THREE.Group | null>(null);
  const accentRef = useRef<THREE.Group | null>(null);
  const hoverMixRef = useRef(0);
  const baseScale = ringConfig.presentation.baseScale * ringScale;
  const primaryGeometry = useMemo(
    () =>
      new THREE.TorusGeometry(
        ringConfig.aura.primary.radius,
        ringConfig.aura.primary.tube,
        18,
        180,
      ),
    [],
  );
  const primaryHaloGeometry = useMemo(
    () =>
      new THREE.TorusGeometry(
        ringConfig.aura.primary.radius,
        ringConfig.aura.primary.tube * 1.9,
        18,
        180,
      ),
    [],
  );
  const accentGeometry = useMemo(
    () =>
      new THREE.TorusGeometry(
        ringConfig.aura.accent.radius,
        ringConfig.aura.accent.tube,
        18,
        160,
      ),
    [],
  );
  const cyan = useMemo(() => new THREE.Color(ringConfig.aura.primary.color), []);
  const magenta = useMemo(() => new THREE.Color(ringConfig.aura.accent.color), []);

  useFrame((state, delta) => {
    hoverMixRef.current = damp(
      hoverMixRef.current,
      interactionRef.current.hovered ? 1 : 0,
      4.2,
      delta,
    );

    const motionScale = reducedMotion ? 0.25 : 1;
    const elapsed = state.clock.elapsedTime;
    const auraScale = baseScale * (mobile ? 0.9 : 1) * (1 + hoverMixRef.current * 0.06);

    if (primaryRef.current) {
      primaryRef.current.rotation.x =
        ringConfig.aura.primary.rotation[0] +
        Math.sin(elapsed * 0.32) * 0.02 * motionScale;
      primaryRef.current.rotation.y =
        ringConfig.aura.primary.rotation[1] +
        elapsed * ringConfig.aura.primary.speed * motionScale;
      primaryRef.current.rotation.z =
        ringConfig.aura.primary.rotation[2] +
        Math.cos(elapsed * 0.28) * 0.03 * motionScale;
      primaryRef.current.scale.set(
        ringConfig.aura.primary.scale[0] * auraScale,
        ringConfig.aura.primary.scale[1] * auraScale,
        ringConfig.aura.primary.scale[2] * auraScale,
      );
    }

    if (accentRef.current) {
      accentRef.current.rotation.x =
        ringConfig.aura.accent.rotation[0] +
        Math.cos(elapsed * 0.36) * 0.03 * motionScale;
      accentRef.current.rotation.y =
        ringConfig.aura.accent.rotation[1] +
        elapsed * ringConfig.aura.accent.speed * motionScale;
      accentRef.current.rotation.z =
        ringConfig.aura.accent.rotation[2] +
        Math.sin(elapsed * 0.26) * 0.04 * motionScale;
      accentRef.current.scale.set(
        ringConfig.aura.accent.scale[0] * auraScale,
        ringConfig.aura.accent.scale[1] * auraScale,
        ringConfig.aura.accent.scale[2] * auraScale,
      );
    }
  });

  return (
    <group position={[0, ringConfig.presentation.basePosition[1] + 0.04, 0]}>
      <group ref={primaryRef}>
        <mesh geometry={primaryHaloGeometry} renderOrder={1}>
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={cyan}
            depthWrite={false}
            opacity={ringConfig.aura.primary.opacity * 0.1}
            side={THREE.DoubleSide}
            toneMapped={false}
            transparent
          />
        </mesh>
        <mesh geometry={primaryGeometry} renderOrder={2}>
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={cyan}
            depthWrite={false}
            opacity={ringConfig.aura.primary.opacity}
            side={THREE.DoubleSide}
            toneMapped={false}
            transparent
          />
        </mesh>
      </group>

      <group ref={accentRef}>
        <mesh geometry={accentGeometry} renderOrder={2}>
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={magenta}
            depthWrite={false}
            opacity={ringConfig.aura.accent.opacity}
            side={THREE.DoubleSide}
            toneMapped={false}
            transparent
          />
        </mesh>
      </group>
    </group>
  );
}
