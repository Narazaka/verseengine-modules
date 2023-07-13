const textureCanvasByObjectCache = new Map<number, HTMLCanvasElement>();

/**
 * get cached canvas object
 *
 * @internal
 *
 * @param id object id
 */
export function getTextureCanvasByObjectCache(id: number) {
  let canvas = textureCanvasByObjectCache.get(id);
  if (!canvas) {
    canvas = document.createElement("canvas");
    textureCanvasByObjectCache.set(id, canvas);
  }
  return canvas;
}
