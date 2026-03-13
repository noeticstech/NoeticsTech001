"use client";

import { Environment, Lightformer } from "@react-three/drei";

type RingEnvironmentProps = {
  mobile: boolean;
};

export function RingEnvironment({ mobile }: RingEnvironmentProps) {
  return (
    <Environment background={false} resolution={mobile ? 128 : 256}>
      <Lightformer
        color="#ffffff"
        form="rect"
        intensity={6.6}
        position={[0, 0.3, 5.8]}
        scale={[10, 7.2, 1]}
      />
      <Lightformer
        color="#ffffff"
        form="rect"
        intensity={4.1}
        position={[0, 4.8, 2.2]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[10, 2.8, 1]}
      />
      <Lightformer
        color="#ffffff"
        form="rect"
        intensity={3}
        position={[0, -4.4, 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[9.6, 2.8, 1]}
      />
      <Lightformer
        color="#ffffff"
        form="rect"
        intensity={2.4}
        position={[4.6, 0.7, 2.6]}
        rotation={[0, -Math.PI / 2.5, 0]}
        scale={[2.2, 8, 1]}
      />
      <Lightformer
        color="#ffffff"
        form="rect"
        intensity={2.1}
        position={[-4.2, 0.25, 2]}
        rotation={[0, Math.PI / 2.45, 0]}
        scale={[2.2, 8, 1]}
      />
      <Lightformer
        color="#ffffff"
        form="ring"
        intensity={1.8}
        position={[0, 0, -3.8]}
        scale={5.2}
      />
    </Environment>
  );
}
