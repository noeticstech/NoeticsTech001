"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { ringConfig } from "@/config/ring";
import { damp } from "@/lib/utils";
import type { RingInteractionState } from "./ring.types";

type RingParticlesProps = {
  interactionRef: MutableRefObject<RingInteractionState>;
  mobile: boolean;
  reducedMotion: boolean;
  ringScale: number;
};

type ParticleSeed = {
  orbit: number;
  angle: number;
  height: number;
  speed: number;
  scale: number;
  opacity: number;
  color: string;
  offset: number;
  stretch: number;
  texturePath: string;
};

const bluePalette = ["#9bdcff", "#66c2ff", "#dff6ff", "#4aa7ff"];
const purplePalette = ["#d96dff", "#c674ff", "#efb0ff", "#9f5eff"];

function pick<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function createParticleSeeds(count: number): ParticleSeed[] {
  const sparkCount = Math.max(8, count);
  const blueCount = Math.ceil(sparkCount * 0.52);
  const purpleCount = sparkCount - blueCount;
  const seeds: ParticleSeed[] = [];

  for (let index = 0; index < blueCount; index += 1) {
    const ratio = index / Math.max(blueCount - 1, 1);
    seeds.push({
      orbit: 1.28 + Math.random() * 0.34,
      angle: Math.random() * Math.PI * 2,
      height:
        (Math.random() * 2 - 1) *
        ringConfig.particles.verticalRange *
        (0.7 + ratio * 0.3),
      speed: 0.075 + Math.random() * 0.085,
      scale:
        ringConfig.particles.sizeMin +
        Math.random() *
          (ringConfig.particles.sizeMax - ringConfig.particles.sizeMin),
      opacity:
        ringConfig.particles.opacityMin +
        Math.random() *
          (ringConfig.particles.opacityMax - ringConfig.particles.opacityMin),
      color: pick(bluePalette),
      offset: Math.random() * Math.PI * 2,
      stretch: 1.5 + Math.random() * 1.6,
      texturePath: pick(ringConfig.particles.blueTexturePaths),
    });
  }

  for (let index = 0; index < purpleCount; index += 1) {
    const ratio = index / Math.max(purpleCount - 1, 1);
    seeds.push({
      orbit: 1.74 + Math.random() * 0.44,
      angle: Math.random() * Math.PI * 2,
      height:
        (Math.random() * 2 - 1) *
        ringConfig.particles.verticalRange *
        (0.55 + ratio * 0.35),
      speed: 0.052 + Math.random() * 0.068,
      scale:
        ringConfig.particles.sizeMin * 0.95 +
        Math.random() *
          (ringConfig.particles.sizeMax - ringConfig.particles.sizeMin),
      opacity:
        ringConfig.particles.opacityMin * 0.9 +
        Math.random() *
          (ringConfig.particles.opacityMax - ringConfig.particles.opacityMin),
      color: pick(purplePalette),
      offset: Math.random() * Math.PI * 2,
      stretch: 1.25 + Math.random() * 1.5,
      texturePath: pick(ringConfig.particles.purpleTexturePaths),
    });
  }

  return seeds;
}

export function RingParticles({
  interactionRef,
  mobile,
  reducedMotion,
  ringScale,
}: RingParticlesProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const spriteRefs = useRef<Array<THREE.Sprite | null>>([]);
  const hoverMixRef = useRef(0);
  const texturePaths = useMemo(
    () => [
      ...ringConfig.particles.blueTexturePaths,
      ...ringConfig.particles.purpleTexturePaths,
    ],
    [],
  );
  const loadedTextures = useTexture(texturePaths);
  const seeds = useMemo(
    () =>
      createParticleSeeds(
        mobile
          ? Math.max(18, ringConfig.particles.count - 10)
          : ringConfig.particles.count,
      ),
    [mobile],
  );
  const textureMap = useMemo(() => {
    return Object.fromEntries(
      texturePaths.map((path, index) => {
        const texture = loadedTextures[index].clone();
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        return [path, texture];
      }),
    ) as Record<string, THREE.Texture>;
  }, [loadedTextures, texturePaths]);
  const baseScale = ringConfig.presentation.baseScale * ringScale;

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    hoverMixRef.current = damp(
      hoverMixRef.current,
      interactionRef.current.hovered ? 1 : 0,
      4.4,
      delta,
    );

    const elapsed = state.clock.elapsedTime;
    group.rotation.y = reducedMotion ? 0.03 : elapsed * 0.05;
    const orbitScale = Math.max(baseScale * 2.4, 0.12);
    const spriteScale = Math.max(baseScale * 1.1, 0.08);

    seeds.forEach((seed, index) => {
      const sprite = spriteRefs.current[index];
      if (!sprite) {
        return;
      }

      const orbitAngle =
        seed.angle +
        elapsed * seed.speed * (reducedMotion ? 0.3 : 1) +
        hoverMixRef.current * 0.08;
      const orbitRadius =
        seed.orbit *
        orbitScale *
        (1 + Math.sin(elapsed * 0.32 + seed.offset) * 0.042);
      const x = Math.cos(orbitAngle) * orbitRadius;
      const z = Math.sin(orbitAngle) * orbitRadius * 0.72;
      const y =
        seed.height * orbitScale +
        Math.sin(elapsed * 0.78 + seed.offset) * 0.05 * orbitScale;
      const scale =
        seed.scale * spriteScale * (1 + hoverMixRef.current * 0.4);

      sprite.position.set(x, y, z);
      sprite.scale.set(scale * 0.4, scale * seed.stretch, 1);
      sprite.material.rotation = orbitAngle + Math.PI / 2;
      sprite.material.opacity =
        seed.opacity *
        (mobile ? 0.88 : 1) *
        (0.88 + hoverMixRef.current * 1.08);
    });
  });

  return (
    <group ref={groupRef}>
      {seeds.map((seed, index) => (
        <sprite
          key={`${seed.angle}-${seed.offset}`}
          ref={(node) => {
            spriteRefs.current[index] = node;
          }}
        >
          <spriteMaterial
            blending={THREE.AdditiveBlending}
            color={seed.color}
            depthWrite={false}
            map={textureMap[seed.texturePath]}
            opacity={seed.opacity}
            transparent
          />
        </sprite>
      ))}
    </group>
  );
}
