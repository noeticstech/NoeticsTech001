"use client";

import * as THREE from "three";

export function createSoftReflectorAlphaTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;

  const context = canvas.getContext("2d");
  if (!context) {
    const fallback = new THREE.Texture();
    fallback.needsUpdate = true;
    return fallback;
  }

  const imageData = context.createImageData(canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 1) {
    const v = y / (canvas.height - 1);
    const vertical = Math.max(0, 1 - Math.abs(v - 0.5) / 0.5);
    const verticalSoft = Math.pow(vertical, 1.6);

    for (let x = 0; x < canvas.width; x += 1) {
      const u = x / (canvas.width - 1);
      const horizontal = Math.max(0, 1 - Math.abs(u - 0.5) / 0.5);
      const horizontalSoft = Math.pow(horizontal, 2.2);
      const alpha = Math.round(horizontalSoft * verticalSoft * 255);
      const index = (y * canvas.width + x) * 4;

      imageData.data[index] = 255;
      imageData.data[index + 1] = 255;
      imageData.data[index + 2] = 255;
      imageData.data[index + 3] = alpha;
    }
  }

  context.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
