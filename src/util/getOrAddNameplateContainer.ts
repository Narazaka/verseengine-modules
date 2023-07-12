import * as THREE from "three";
import { getOrAddObject } from "./getOrAddObject";
import { namePlatePositionHeight } from "./namePlatePositionHeight";

export function getOrAddNameplateContainer(
  parent: THREE.Object3D,
  avatarObject: THREE.Object3D | undefined,
  options?: { adjustPosition?: boolean },
) {
  return getOrAddObject(
    parent,
    "nameplateContainer",
    () => new THREE.Object3D(),
    {
      afterCreate: (container) => {
        container.position.y = namePlatePositionHeight(avatarObject);
      },
      afterExists: options?.adjustPosition
        ? (container) => {
            container.position.y = namePlatePositionHeight(avatarObject);
          }
        : undefined,
    },
  );
}
