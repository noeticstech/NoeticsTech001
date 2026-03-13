"use client";

import { sceneConfig } from "@/config/scene";

export function RingLighting() {
  return (
    <>
      <ambientLight color="#ffffff" intensity={0.82} />
      <hemisphereLight color="#ffffff" groundColor="#c4cfdb" intensity={0.72} />
      <spotLight
        angle={0.3}
        castShadow
        color="#ffffff"
        intensity={8.8}
        penumbra={1}
        position={sceneConfig.lighting.key}
        shadow-bias={-0.00008}
      />
      <spotLight
        angle={0.42}
        color="#ffffff"
        intensity={4.2}
        penumbra={1}
        position={sceneConfig.lighting.rim}
      />
      <pointLight
        color="#ffffff"
        distance={14}
        intensity={3}
        position={sceneConfig.lighting.fill}
      />
      <pointLight color="#ffffff" distance={12} intensity={2.1} position={[0, -0.34, 4.6]} />
      <pointLight color="#f7fbff" distance={12} intensity={2} position={[-3.2, 0.8, 4.2]} />
      <pointLight color="#f7fbff" distance={12} intensity={2} position={[3.2, 0.8, 4.2]} />
    </>
  );
}
