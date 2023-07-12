import * as THREE from "three";

export function namePlatePositionHeight(
  avatarObject: THREE.Object3D | undefined,
) {
  if (!avatarObject) {
    return 2;
  }
  const bbox = new THREE.Box3().setFromObject(avatarObject);
  return bbox.max.y - bbox.min.y + 0.3;
}
