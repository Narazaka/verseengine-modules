import type { VerseModuleBase } from "./VerseModuleBase";
import type { PlayerSessionIdData } from "./playerSessionId";
import { getOrAddNameplareContainer } from "./util/getOrAddNameplareContainer";

export default ({
  player,
  avatarChangedListeners,
  otherPersonAvatarChangedListeners,
}: VerseModuleBase<{}, PlayerSessionIdData>) => ({
  initialize() {
    avatarChangedListeners.push(() => {
      getOrAddNameplareContainer(player.object3D, player.avatar.object3D, {
        adjustPosition: true,
      });
    });
    otherPersonAvatarChangedListeners.push((otherPerson) => {
      getOrAddNameplareContainer(
        otherPerson.object3D,
        otherPerson.avatar?.object3D,
        { adjustPosition: true },
      );
    });
  },
});
