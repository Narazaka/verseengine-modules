import type { VerseModuleBase } from "./VerseModuleBase";
import type { PlayerSessionIdData } from "./playerSessionId";
import { getOrAddNameplateContainer } from "./util/getOrAddNameplateContainer";

export default ({
  player,
  avatarChangedListeners,
  otherPersonAvatarChangedListeners,
}: VerseModuleBase<{}, PlayerSessionIdData>) => ({
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
