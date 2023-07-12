import { isMobile } from "./util/isMobile";
import { VerseModuleBase } from "./VerseModuleBase";

export default ({ playerController }: VerseModuleBase) => ({
  initialize() {
    if (!isMobile()) {
      playerController.moveController.enabled = true;
      playerController.touchController.enabled = false;
    }
  },
});
