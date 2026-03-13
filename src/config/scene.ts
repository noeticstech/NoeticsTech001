export const sceneConfig = {
  mobileBreakpoint: 820,
  camera: {
    position: [0, 0.06, 8.4] as [number, number, number],
    fov: 18,
    near: 0.1,
    far: 30,
  },
  canvas: {
    dpr: [1, 1.8] as [number, number],
  },
  postprocessing: {
    bloomIntensity: 0.14,
    mobileBloomIntensity: 0.08,
    luminanceThreshold: 0.89,
    luminanceSmoothing: 0.18,
  },
  lighting: {
    key: [1.25, 3.6, 7.8] as [number, number, number],
    rim: [-4.4, 1.9, 3.6] as [number, number, number],
    fill: [0.1, 0.24, 6.7] as [number, number, number],
  },
  shadows: {
    position: [0, -1.32, 0] as [number, number, number],
    scale: 5.2,
    blur: 2.5,
    opacity: 0.14,
  },
} as const;
