/**
 * the nameplate
 * @packageDocumentation
 */
import * as THREE from "three";
import { getOrAddSprite } from "./util/getOrAddSprite";
import type { VerseModuleBase } from "./VerseModuleBase";
import type { PlayerSessionIdData } from "./playerSessionId";
import { getOrAddNameplateContainer } from "./util/getOrAddNameplateContainer";
import { playerName } from "./util/playerName";

const nameMaxLength = 20;

/** @internal */
export function createNameInput(parent: HTMLElement) {
  const $button = document.createElement("button");
  $button.type = "submit";
  $button.textContent = "名前変更";

  const $input = document.createElement("input");
  $input.maxLength = nameMaxLength;
  $input.placeholder = "名前";

  const $form = document.createElement("form");
  $form.appendChild($input);
  $form.appendChild($button);
  $form.style.position = "absolute";
  $form.style.top = "10px";
  $form.style.left = "10px";
  $form.style.width = "300px";
  $form.style.height = "50px";

  $form.appendChild($input);
  $form.appendChild($button);

  const name = localStorage.getItem("name");
  if (name) {
    $input.value = name;
  }

  parent.appendChild($form);
  return (onChange: (name: string) => unknown) => {
    const onChangeInner = (e?: SubmitEvent) => {
      e?.preventDefault();
      const name = $input.value.trim().substring(0, nameMaxLength);
      localStorage.setItem("name", name);
      onChange(name);
    };
    onChangeInner();

    $form.addEventListener("submit", onChangeInner);
  };
}

const nameplateCanvasCache = new Map<number, HTMLCanvasElement>();

/**
 * get cached canvas object
 *
 * @internal
 *
 * @param id nameplate object id
 */
export function getNameplateTextureCanvasCache(id: number) {
  let canvas = nameplateCanvasCache.get(id);
  if (!canvas) {
    canvas = document.createElement("canvas");
    nameplateCanvasCache.set(id, canvas);
  }
  return canvas;
}

export type NameplateTextureOptions = {
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
 * get nameplate drawn canvas for the text
 *
 * @internal
 *
 * @param text the text
 * @param idOrCanvas the nameplate object id for canvas cache or the target canvas
 * @param options options
 */
export function getNameplateTextureCanvas(
  text: string,
  idOrCanvas: number | HTMLCanvasElement,
  options?: NameplateTextureOptions,
) {
  const canvas =
    typeof idOrCanvas === "number"
      ? getNameplateTextureCanvasCache(idOrCanvas)
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

export type NameplateSpriteData = {
  material: THREE.SpriteMaterial;
  scale: {
    x: number;
    y: number;
    z: number;
  };
};

/**
 * get nameplate drawn sprite for the text
 *
 * @internal
 *
 * @param text the text
 * @param idOrCanvas the nameplate object id for canvas cache or the target canvas
 * @param options options
 */
export function createNameplateSpriteData(
  text: string,
  idOrCanvas: number | HTMLCanvasElement,
  options?: NameplateTextureOptions,
): NameplateSpriteData {
  const canvas = getNameplateTextureCanvas(text, idOrCanvas, options);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  return {
    material,
    scale: { x: canvas.width / 1000, y: canvas.height / 1000, z: 1 },
  };
}

const nameCache = new Map<string, string | undefined>();

function handleNameplate(
  parent: THREE.Object3D,
  avatarObject: THREE.Object3D,
  id: string,
  name: string | undefined,
  options?: NameplateTextureOptions,
) {
  const nameplate = getOrAddSprite(
    getOrAddNameplateContainer(parent, avatarObject),
    "nameplate",
  );
  const previousName = nameCache.get(id);
  const useName = playerName(name);
  if (previousName === useName) return;

  const { material, scale } = createNameplateSpriteData(
    useName,
    nameplate.id,
    options,
  );
  nameplate.material = material;
  nameplate.scale.set(scale.x, scale.y, scale.z);
  nameCache.set(id, useName);
}

export type PlayerNameData = {
  name?: string;
};

/**
 * the nameplate
 */
export default ({
  getData,
  putData,
  player,
  addTextDataChangedListener,
  domRoot,
}: VerseModuleBase<PlayerNameData, PlayerSessionIdData>) => ({
  initialize(options?: {
    /**
     * displays local player's nameplate
     *
     * @default true
     */
    local?: boolean;
    /**
     * nameplate texture options
     */
    nameplateTextureOptions?: NameplateTextureOptions;
    /**
     * name change handler
     *
     * @param onChange called on name change
     *
     * @example
     * ```ts
     * verseModule.initialize(nameplate, {
     *   handleNameChange: (onChange) => {
     *     $input.addEventListener("change", (e) => {
     *       onChange($input.value.trim());
     *     });
     *   },
     * });
     * ```
     */
    handleNameChange?: (onChange: (name: string) => unknown) => unknown;
  }) {
    (options?.handleNameChange || createNameInput(domRoot))((name) => {
      putData({ name });
      if (options?.local !== false)
        handleNameplate(
          player.object3D,
          player.avatar.object3D,
          getData().playerSessionId,
          name,
          options?.nameplateTextureOptions,
        );
    });

    addTextDataChangedListener((otherPerson, data) => {
      handleNameplate(
        otherPerson.object3D,
        otherPerson.avatar?.object3D,
        data.playerSessionId,
        data.name,
        options?.nameplateTextureOptions,
      );
    });
  },
});
