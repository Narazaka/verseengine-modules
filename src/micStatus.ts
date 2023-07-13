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

/** @internal */
export async function generateHandleMuteMark(textureUrl: string) {
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
          s.position.y = 0.3;
          s.scale.set(0.15, 0.15, 0.15);
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
  async initialize(options: { textureUrl: string }) {
    const handleMuteMark = await generateHandleMuteMark(options.textureUrl);
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
