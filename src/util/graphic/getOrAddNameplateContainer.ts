import * as THREE from "three";
import { getOrAddObject } from "./getOrAddObject";
import {
  NameplatePositionHeightOptions,
  nameplatePositionHeight,
} from "./namePlatePositionHeight";

export type GetOrAddNameplateContainerOptions = {
  /** re-adjust position even when the nameplate container exists */
  adjustPosition?: boolean;
};

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
  options?: GetOrAddNameplateContainerOptions & NameplatePositionHeightOptions,
) {
  return getOrAddObject(
    parent,
    "nameplateContainer",
    () => new THREE.Object3D(),
    {
      afterCreate: (container) => {
        container.position.y = nameplatePositionHeight(avatarObject, options);
      },
      afterExists: options?.adjustPosition
        ? (container) => {
            container.position.y = nameplatePositionHeight(
              avatarObject,
              options,
            );
          }
        : undefined,
    },
  );
}
