/**
 * enables move controller when not on a mobile device
 * @packageDocumentation
 */
import { isMobile } from "./util/isMobile";
import { VerseModuleBase } from "./VerseModuleBase";

/**
 * enables move controller when not on a mobile device
 */
export default ({ playerController }: VerseModuleBase) => ({
  initialize() {
    if (!isMobile()) {
      playerController.moveController.enabled = true;
      playerController.touchController.enabled = false;
    }
  },
});
