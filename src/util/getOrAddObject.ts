import * as THREE from "three";

/**
 * get named object if it exists, otherwise add it
 *
 * @param parent parent object
 * @param name object name to find
 * @param create create the object when it does not exists
 * @param options options
 */
export function getOrAddObject<
  T extends THREE.Object3D<THREE.Event> = THREE.Object3D<THREE.Event>,
>(
  parent: THREE.Object3D<THREE.Event>,
  name: string,
  create?: () => T,
  options?: {
    /** emitted when object does not exists */
    afterCreate?: (obj: T) => unknown;
    /** emitted when object exists */
    afterExists?: (obj: T) => unknown;
  },
) {
  let obj = parent.getObjectByName(name) as T | undefined;
  if (obj) {
    options?.afterExists?.(obj as T);
  } else {
    obj = create ? create() : (new THREE.Object3D() as T);
    obj.name = name;
    parent.add(obj);
    options?.afterCreate?.(obj as T);
  }
  return obj;
}
