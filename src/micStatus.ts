/**
 * displays mic status on the nameplate
 * @packageDocumentation
 */
import * as THREE from "three";
import { getOrAddSprite } from "./util/graphic/getOrAddSprite";
import { VerseModuleBase } from "./VerseModuleBase";
import { getOrAddNameplateContainer } from "./util/graphic/getOrAddNameplateContainer";

export type MuteMarkData = {
  isMicOn?: boolean;
};

export type MuteMarkOptions = {
  position?: { x?: number; y?: number };
  scale?: { x?: number; y?: number; z?: number };
};

/** @internal */
export async function generateHandleMuteMark(
  textureUrl: string,
  options?: MuteMarkOptions,
) {
  const loader = new THREE.TextureLoader();
  const tex = await loader.loadAsync(textureUrl);
  const mat = new THREE.SpriteMaterial({ map: tex });

  return function handleMuteMark(
    parent: THREE.Object3D,
    avatarObject: THREE.Object3D,
    isMicOn: boolean | undefined,
  ) {
    const muteMark = getOrAddSprite(
      getOrAddNameplateContainer(parent, avatarObject),
      "muteMark",
      {
        afterCreate: (s) => {
          s.position.x = options?.position?.x || 0;
          s.position.y = options?.position?.y || 0.2;
          s.scale.set(
            options?.scale?.x || 0.1,
            options?.scale?.y || 0.1,
            options?.scale?.z || 0.1,
          );
          s.material = mat;
        },
      },
    );
    muteMark.visible = !isMicOn;
  };
}

/**
 * displays mic status on the nameplate
 */
export default ({
  player,
  guiHandlers,
  putData,
  addTextDataChangedListener,
}: VerseModuleBase<MuteMarkData>) => ({
  async initialize(options: { textureUrl: string; options?: MuteMarkOptions }) {
    const handleMuteMark = await generateHandleMuteMark(
      options.textureUrl,
      options.options,
    );
    const micOnChange = () => {
      const data: MuteMarkData = { isMicOn: guiHandlers.isMicOn() };
      putData(data);
      handleMuteMark(player.object3D, player.avatar.object3D, data.isMicOn);
    };
    micOnChange();
    guiHandlers.addModifiedListener(micOnChange);
    addTextDataChangedListener((otherPerson, data) => {
      handleMuteMark(
        otherPerson.object3D,
        otherPerson.avatar?.object3D,
        data.isMicOn,
      );
    });
  },
});
