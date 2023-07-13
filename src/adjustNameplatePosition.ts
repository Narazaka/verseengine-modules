/**
 * adjust nameplate position when changing avatars
 * @packageDocumentation
 */
import type { VerseModuleBase } from "./VerseModuleBase";
import { getOrAddNameplateContainer } from "./util/getOrAddNameplateContainer";

/**
 * adjust nameplate position when changing avatars
 */
export default ({
  player,
  avatarChangedListeners,
  otherPersonAvatarChangedListeners,
}: VerseModuleBase<{}, {}>) => ({
  initialize() {
    avatarChangedListeners.push(() => {
      getOrAddNameplateContainer(player.object3D, player.avatar.object3D, {
        adjustPosition: true,
      });
    });
    otherPersonAvatarChangedListeners.push((otherPerson) => {
      getOrAddNameplateContainer(
        otherPerson.object3D,
        otherPerson.avatar?.object3D,
        { adjustPosition: true },
      );
    });
  },
});
