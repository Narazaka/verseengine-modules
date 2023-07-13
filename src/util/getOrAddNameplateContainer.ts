import * as THREE from "three";
import { getOrAddObject } from "./getOrAddObject";
import { nameplatePositionHeight } from "./namePlatePositionHeight";

/**
 * get the nameplate container object if it exists, otherwise add it
 *
 * @param parent parent object
 * @param avatarObject avatar object for position detection
 * @param options options
 * @returns
 */
export function getOrAddNameplateContainer(
  parent: THREE.Object3D,
  avatarObject: THREE.Object3D | undefined,
  options?: {
    /** re-adjust position even when the nameplate container exists */
    adjustPosition?: boolean;
  },
) {
  return getOrAddObject(
    parent,
    "nameplateContainer",
    () => new THREE.Object3D(),
    {
      afterCreate: (container) => {
        container.position.y = nameplatePositionHeight(avatarObject);
      },
      afterExists: options?.adjustPosition
        ? (container) => {
            container.position.y = nameplatePositionHeight(avatarObject);
          }
        : undefined,
    },
  );
}
