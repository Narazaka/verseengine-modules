import * as THREE from "three";

export function getOrAddObject<
  T extends THREE.Object3D<THREE.Event> = THREE.Object3D<THREE.Event>,
>(
  parent: THREE.Object3D<THREE.Event>,
  name: string,
  create?: () => T,
  options?: {
    afterCreate?: (obj: T) => unknown;
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
