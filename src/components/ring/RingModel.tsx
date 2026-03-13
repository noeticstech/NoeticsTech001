"use client";

import { Decal, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { ringConfig } from "@/config/ring";
import { createBandSurfaceTexture } from "@/lib/ring-textures";
import { damp } from "@/lib/utils";
import type { RingInteractionState } from "./ring.types";

type RingModelProps = {
  interactionRef: MutableRefObject<RingInteractionState>;
  mobile: boolean;
  reducedMotion: boolean;
  ringScale: number;
};

const baseRotation = new THREE.Euler(
  ...ringConfig.presentation.baseRotation,
  "XYZ",
);

const ringProfile = [
  new THREE.Vector2(
    ringConfig.outerRadius - ringConfig.outerBevel * 2.6,
    -ringConfig.bandHalfWidth,
  ),
  new THREE.Vector2(
    ringConfig.outerRadius - ringConfig.outerBevel * 0.18,
    -ringConfig.bandHalfWidth,
  ),
  new THREE.Vector2(
    ringConfig.outerRadius,
    -ringConfig.bandHalfWidth + ringConfig.outerBevel * 1.06,
  ),
  new THREE.Vector2(
    ringConfig.outerRadius,
    ringConfig.bandHalfWidth - ringConfig.outerBevel * 1.06,
  ),
  new THREE.Vector2(
    ringConfig.outerRadius - ringConfig.outerBevel * 0.18,
    ringConfig.bandHalfWidth,
  ),
  new THREE.Vector2(
    ringConfig.outerRadius - ringConfig.outerBevel * 2.6,
    ringConfig.bandHalfWidth,
  ),
  new THREE.Vector2(
    ringConfig.innerRadius + ringConfig.innerLipInset + ringConfig.innerBevel,
    ringConfig.bandHalfWidth,
  ),
  new THREE.Vector2(
    ringConfig.innerRadius,
    ringConfig.bandHalfWidth - ringConfig.innerLipDepth,
  ),
  new THREE.Vector2(
    ringConfig.innerRadius,
    ringConfig.bandHalfWidth - ringConfig.innerBevel,
  ),
  new THREE.Vector2(
    ringConfig.innerRadius,
    -ringConfig.bandHalfWidth + ringConfig.innerBevel,
  ),
  new THREE.Vector2(
    ringConfig.innerRadius,
    -ringConfig.bandHalfWidth + ringConfig.innerLipDepth,
  ),
  new THREE.Vector2(
    ringConfig.innerRadius + ringConfig.innerLipInset + ringConfig.innerBevel,
    -ringConfig.bandHalfWidth,
  ),
  new THREE.Vector2(
    ringConfig.outerRadius - ringConfig.outerBevel * 2.6,
    -ringConfig.bandHalfWidth,
  ),
];

const outerRingGeometry = new THREE.LatheGeometry(
  ringProfile,
  ringConfig.segments,
);
outerRingGeometry.computeVertexNormals();

export function RingModel({
  interactionRef,
  mobile,
  reducedMotion,
  ringScale,
}: RingModelProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const outerMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const loadedLogoTexture = useTexture(ringConfig.logo.texturePath);
  const hoverMixRef = useRef(0);

  const logoTexture = useMemo(() => {
    const texture = loadedLogoTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, [loadedLogoTexture]);
  const bandSurfaceTexture = useMemo(() => createBandSurfaceTexture(), []);
  const baseScale = ringConfig.presentation.baseScale * ringScale;
  const logoRadius = ringConfig.outerRadius + ringConfig.logo.positionOffset;
  const logoYaw = ringConfig.logo.yaw;
  const logoPosition = useMemo(
    () =>
      [
        Math.sin(logoYaw) * logoRadius,
        ringConfig.logo.heightOffset,
        Math.cos(logoYaw) * logoRadius,
      ] as [number, number, number],
    [logoRadius, logoYaw],
  );
  const logoRotation = useMemo(
    () => [0, logoYaw, 0] as [number, number, number],
    [logoYaw],
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const interaction = interactionRef.current;
    if (!interaction.pressed) {
      interaction.drag.x = damp(
        interaction.drag.x,
        0,
        ringConfig.interaction.returnDamping,
        delta,
      );
      interaction.drag.y = damp(
        interaction.drag.y,
        0,
        ringConfig.interaction.returnDamping,
        delta,
      );
    }

    const hoverTarget = interaction.hovered ? 1 : 0;
    hoverMixRef.current = damp(
      hoverMixRef.current,
      hoverTarget,
      reducedMotion ? 3.2 : ringConfig.interaction.damping,
      delta,
    );

    const elapsed = state.clock.elapsedTime;
    const idleFloat = reducedMotion
      ? 0
      : Math.sin(elapsed * ringConfig.interaction.idleFloatFrequency) *
        ringConfig.interaction.idleFloatAmplitude;
    const idleYaw = reducedMotion
      ? 0
      : Math.sin(elapsed * ringConfig.interaction.idleYawFrequency) *
        ringConfig.interaction.idleYawAmplitude;
    const idleRoll = reducedMotion
      ? 0
      : Math.sin(elapsed * 0.42) * ringConfig.interaction.idleRollAmplitude;

    const targetX =
      baseRotation.x +
      interaction.pointer.y *
        ringConfig.interaction.hoverTiltX *
        hoverMixRef.current +
      interaction.drag.y * ringConfig.interaction.dragPitch;
    const targetY =
      baseRotation.y +
      idleYaw +
      interaction.pointer.x *
        ringConfig.interaction.hoverTiltY *
        hoverMixRef.current +
      interaction.drag.x * ringConfig.interaction.dragYaw;
    const targetZ =
      baseRotation.z +
      idleRoll -
      interaction.pointer.x *
        ringConfig.interaction.hoverTiltZ *
        hoverMixRef.current -
      interaction.drag.x * 0.22;
    const targetScale =
      baseScale *
      (1 +
        hoverMixRef.current *
          (mobile ? 0.024 : ringConfig.interaction.hoverScale - 1));

    group.rotation.x = damp(group.rotation.x, targetX, 5.4, delta);
    group.rotation.y = damp(group.rotation.y, targetY, 5.4, delta);
    group.rotation.z = damp(group.rotation.z, targetZ, 5.4, delta);
    group.position.x = damp(
      group.position.x,
      ringConfig.presentation.basePosition[0] +
        interaction.pointer.x * hoverMixRef.current * 0.12,
      4.6,
      delta,
    );
    group.position.y = damp(
      group.position.y,
      ringConfig.presentation.basePosition[1] +
        idleFloat +
        interaction.pointer.y * hoverMixRef.current * 0.12 +
        hoverMixRef.current * ringConfig.interaction.hoverLift,
      4.8,
      delta,
    );
    group.position.z = damp(
      group.position.z,
      ringConfig.presentation.basePosition[2] + hoverMixRef.current * 0.065,
      4.8,
      delta,
    );

    const nextScale = damp(group.scale.x, targetScale, 5.2, delta);
    group.scale.setScalar(nextScale);

    if (outerMaterialRef.current) {
      outerMaterialRef.current.roughness = damp(
        outerMaterialRef.current.roughness,
        ringConfig.material.roughness,
        4.6,
        delta,
      );
      outerMaterialRef.current.envMapIntensity = damp(
        outerMaterialRef.current.envMapIntensity,
        ringConfig.material.envMapIntensity,
        4.6,
        delta,
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={ringConfig.presentation.basePosition}
      rotation={ringConfig.presentation.baseRotation}
      scale={baseScale}
    >
      <mesh castShadow geometry={outerRingGeometry} receiveShadow>
        <meshPhysicalMaterial
          ref={outerMaterialRef}
          clearcoat={ringConfig.material.clearcoat}
          clearcoatRoughness={ringConfig.material.clearcoatRoughness}
          color={ringConfig.material.color}
          emissive={ringConfig.material.emissive}
          emissiveIntensity={ringConfig.material.emissiveIntensity}
          envMapIntensity={ringConfig.material.envMapIntensity}
          metalness={ringConfig.material.metalness}
          roughness={ringConfig.material.roughness}
          roughnessMap={bandSurfaceTexture}
          reflectivity={0.9}
          side={THREE.FrontSide}
        />
        <Decal
          position={logoPosition}
          rotation={logoRotation}
          scale={ringConfig.logo.scale}
        >
          <meshBasicMaterial
            color="#0b0b0c"
            map={logoTexture}
            polygonOffset
            polygonOffsetFactor={-2}
            toneMapped={false}
            transparent
          />
        </Decal>
      </mesh>
    </group>
  );
}
