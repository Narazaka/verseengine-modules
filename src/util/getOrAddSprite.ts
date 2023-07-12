import * as THREE from "three";
import { getOrAddObject } from "./getOrAddObject";

export function getOrAddSprite(
  parent: THREE.Object3D<THREE.Event>,
  name: string,
  afterCreate?: (sprite: THREE.Sprite) => unknown,
) {
  return getOrAddObject(parent, name, () => new THREE.Sprite(), {
    afterCreate,
  });
}
