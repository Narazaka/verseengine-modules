/**
 * the nameplate
 * @packageDocumentation
 */
import * as THREE from "three";
import { getOrAddSprite } from "./util/graphic/getOrAddSprite";
import type { VerseModuleBase } from "./VerseModuleBase";
import type { PlayerSessionIdData } from "./playerSessionId";
import { getOrAddNameplateContainer } from "./util/graphic/getOrAddNameplateContainer";
import { playerName } from "./util/playerName";
import { NameplatePositionHeightOptions } from "./util/graphic/namePlatePositionHeight";
import { TextTextureOptions } from "./util/graphic/getTextTextureCanvas";
import { createTextSpriteData } from "./util/graphic/createTextSpriteData";

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

const nameCache = new Map<string, string | undefined>();

function handleNameplate(
  parent: THREE.Object3D,
  avatarObject: THREE.Object3D,
  id: string,
  name: string | undefined,
  nameplatePositionHeightOptions?: NameplatePositionHeightOptions,
  textTextureOptions?: TextTextureOptions,
) {
  let exists = false;
  const nameplate = getOrAddSprite(
    getOrAddNameplateContainer(
      parent,
      avatarObject,
      nameplatePositionHeightOptions,
    ),
    "nameplate",
    {
      afterExists: () => {
        exists = true;
      },
    },
  );
  const previousName = nameCache.get(id);
  const useName = playerName(name);
  if (previousName === useName) return;

  const { material, scale } = createTextSpriteData(
    useName,
    nameplate.id,
    textTextureOptions,
  );
  if (exists) {
    nameplate.material.map?.dispose();
    nameplate.material.dispose();
  }
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
     * nameplate position height options
     */
    nameplatePositionHeightOptions?: NameplatePositionHeightOptions;
    /**
     * nameplate texture options
     */
    textTextureOptions?: TextTextureOptions;
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
          options?.nameplatePositionHeightOptions,
          options?.textTextureOptions,
        );
    });

    addTextDataChangedListener((otherPerson, data) => {
      handleNameplate(
        otherPerson.object3D,
        otherPerson.avatar?.object3D,
        data.playerSessionId,
        data.name,
        options?.nameplatePositionHeightOptions,
        options?.textTextureOptions,
      );
    });
  },
});
