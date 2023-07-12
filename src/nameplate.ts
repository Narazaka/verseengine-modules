import * as THREE from "three";
import { getOrAddSprite } from "./util/getOrAddSprite";
import type { VerseModuleBase } from "./VerseModuleBase";
import type { PlayerSessionIdData } from "./playerSessionId";
import { getOrAddNameplareContainer } from "./util/getOrAddNameplareContainer";

const nameMaxLength = 20;

function createNameInput(parent: HTMLElement) {
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

const font = `128px sans-serif`;

const nameplateCanvasCache = new Map<number, HTMLCanvasElement>();

function getNameplateTextureCanvas(text: string, id: number) {
  let canvas = nameplateCanvasCache.get(id);
  if (!canvas) {
    canvas = document.createElement("canvas");
    nameplateCanvasCache.set(id, canvas);
  }
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = font;
  const textMetrics = ctx.measureText(text);

  ctx.canvas.width = textMetrics.width + 200;
  ctx.canvas.height = textMetrics.actualBoundingBoxAscent + 100;

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "white";
  ctx.font = font;
  ctx.fillText(
    text,
    (ctx.canvas.width - textMetrics.width) / 2,
    (ctx.canvas.height + textMetrics.actualBoundingBoxAscent) / 2,
  );
  return canvas;
}

function createNameplateSpriteData(text: string, id: number) {
  const canvas = getNameplateTextureCanvas(text, id);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  return {
    material,
    scale: { x: canvas.width / 1000, y: canvas.height / 1000, z: 1 },
  };
}

const nameCache = new Map<string, string | undefined>();

export function handleNameplate(
  parent: THREE.Object3D,
  avatarObject: THREE.Object3D,
  id: string,
  name: string | undefined,
  noname?: string,
) {
  const nameplate = getOrAddSprite(
    getOrAddNameplareContainer(parent, avatarObject),
    "nameplate",
  );
  const previousName = nameCache.get(id);
  const useName = name || noname || "<noname>";
  if (previousName === useName) return;

  const { material, scale } = createNameplateSpriteData(useName, nameplate.id);
  nameplate.material = material;
  nameplate.scale.set(scale.x, scale.y, scale.z);
  nameCache.set(id, useName);
}

export type PlayerNameData = {
  name?: string;
};

export default ({
  getData,
  putData,
  player,
  addTextDataChangedListener,
  domRoot,
}: VerseModuleBase<PlayerNameData, PlayerSessionIdData>) => ({
  initialize(options?: {
    local?: boolean;
    noname?: string;
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
          options?.noname,
        );
    });

    addTextDataChangedListener((otherPerson, data) => {
      handleNameplate(
        otherPerson.object3D,
        otherPerson.avatar?.object3D,
        data.playerSessionId,
        data.name,
        options?.noname,
      );
    });
  },
});
