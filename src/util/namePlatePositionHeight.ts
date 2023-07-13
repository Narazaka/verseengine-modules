import * as THREE from "three";

export type NameplatePositionHeightOptions = {
  /**
   * offset from avatar bounds top
   *
   * @default 0.3
   */
  offset?: number;
  /**
   * the height when avatar bounds not available
   *
   * @default 2
   */
  defaultHeight?: number;
};

/** detect nameplate position by avatar bounds */
export function nameplatePositionHeight(
  avatarObject: THREE.Object3D | undefined,
  options?: NameplatePositionHeightOptions,
) {
  if (!avatarObject) {
    return options?.defaultHeight || 2;
  }
  const bbox = new THREE.Box3().setFromObject(avatarObject);
  return bbox.max.y - bbox.min.y + (options?.offset || 0.3);
}
