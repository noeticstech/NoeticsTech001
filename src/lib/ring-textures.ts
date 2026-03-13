"use client";

import * as THREE from "three";

export function createBandSurfaceTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) {
    const fallback = new THREE.Texture();
    fallback.needsUpdate = true;
    return fallback;
  }

  const imageData = context.createImageData(canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 1) {
    const v = y / (canvas.height - 1);
    let roughness = 0.62;

    if (v > 0.14 && v < 0.34) {
      roughness = 0.26;
    } else if (v >= 0.34 && v < 0.46) {
      roughness = 0.34;
    } else if (v >= 0.46 && v < 0.56) {
      roughness = 0.54;
    } else if (v >= 0.56 && v < 0.72) {
      roughness = 0.44;
    } else if (v >= 0.72 && v < 0.9) {
      roughness = 0.68;
    }

    for (let x = 0; x < canvas.width; x += 1) {
      const columnNoise =
        Math.sin((x / canvas.width) * Math.PI * 24) * 0.008 +
        Math.sin((x / canvas.width) * Math.PI * 57) * 0.004;
      const grain = (Math.random() - 0.5) * 0.012;
      const value = Math.max(
        0,
        Math.min(255, Math.round((roughness + columnNoise + grain) * 255)),
      );
      const index = (y * canvas.width + x) * 4;

      imageData.data[index] = value;
      imageData.data[index + 1] = value;
      imageData.data[index + 2] = value;
      imageData.data[index + 3] = 255;
    }
  }

  context.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
