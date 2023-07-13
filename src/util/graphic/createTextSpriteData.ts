import * as THREE from "three";
import {
  NameplateTextureOptions,
  getTextTextureCanvas,
} from "./getTextTextureCanvas";

export type NameplateSpriteData = {
  material: THREE.SpriteMaterial;
  scale: {
    x: number;
    y: number;
    z: number;
  };
};

/**
 * get text drawn sprite
 *
 * @internal
 *
 * @param text the text
 * @param idOrCanvas the nameplate object id for canvas cache or the target canvas
 * @param options options
 */
export function createTextSpriteData(
  text: string,
  idOrCanvas: number | HTMLCanvasElement,
  options?: NameplateTextureOptions,
): NameplateSpriteData {
  const canvas = getTextTextureCanvas(text, idOrCanvas, options);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  return {
    material,
    scale: { x: canvas.width / 1000, y: canvas.height / 1000, z: 1 },
  };
}
