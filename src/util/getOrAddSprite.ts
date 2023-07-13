import * as THREE from "three";
import { getOrAddObject } from "./getOrAddObject";

/**
 * get named sprite if it exists, otherwise add it
 *
 * @param parent parent object
 * @param name object name to find
 * @param options options
 */
export function getOrAddSprite(
  parent: THREE.Object3D<THREE.Event>,
  name: string,
  options?: {
    /** emitted when object does not exists */
    afterCreate?: (sprite: THREE.Sprite) => unknown;
    /** emitted when object exists */
    afterExists?: (sprite: THREE.Sprite) => unknown;
  },
) {
  return getOrAddObject(parent, name, () => new THREE.Sprite(), options);
}
