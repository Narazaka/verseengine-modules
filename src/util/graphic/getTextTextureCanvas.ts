import { getTextureCanvasByObjectCache } from "./getTextureCanvasByObjectCache";

export type TextTextureOptions = {
  /**
   * text font
   *
   * @default "128px sans-serif"
   */
  font?: string;
  /**
   * text fillStyle
   *
   * @default "white"
   */
  style?: string | CanvasGradient | CanvasPattern;
  /**
   * background fillStyle
   *
   * @default "rgba(0, 0, 0, 0.3)"
   */
  backgroundStyle?: string | CanvasGradient | CanvasPattern;
  /** nameplate canvas padding from text bounds */
  padding?: {
    /** @default 100 */
    width?: number;
    /** @default 50 */
    height?: number;
  };
  /**
   * custom background drawing
   */
  onBackground?(
    ctx: CanvasRenderingContext2D,
    text: string,
    textMetrics: TextMetrics,
  ): unknown;
  /**
   * custom text drawing
   */
  onText?(
    ctx: CanvasRenderingContext2D,
    text: string,
    textMetrics: TextMetrics,
  ): unknown;
};

const font = "128px sans-serif";

/**
 * get text drawn canvas
 *
 * @internal
 *
 * @param text the text
 * @param idOrCanvas the nameplate object id for canvas cache or the target canvas
 * @param options options
 */

export function getTextTextureCanvas(
  text: string,
  idOrCanvas: number | HTMLCanvasElement,
  options?: TextTextureOptions,
) {
  const canvas =
    typeof idOrCanvas === "number"
      ? getTextureCanvasByObjectCache(idOrCanvas)
      : idOrCanvas;

  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = options?.font || font;
  const textMetrics = ctx.measureText(text);

  ctx.canvas.width = textMetrics.width + (options?.padding?.width || 100) * 2;
  ctx.canvas.height =
    textMetrics.actualBoundingBoxAscent + (options?.padding?.height || 50) * 2;

  ctx.fillStyle = options?.backgroundStyle || "rgba(0, 0, 0, 0.3)";
  if (options?.onBackground) {
    options.onBackground(ctx, text, textMetrics);
  } else {
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  ctx.fillStyle = options?.style || "white";
  ctx.font = options?.font || font;
  if (options?.onText) {
    options.onText(ctx, text, textMetrics);
  } else {
    ctx.fillText(
      text,
      (ctx.canvas.width - textMetrics.width) / 2,
      (ctx.canvas.height + textMetrics.actualBoundingBoxAscent) / 2,
    );
  }
  return canvas;
}
