import { VerseModuleBase } from "./VerseModuleBase";

export default ({ envAdapter, playerController }: VerseModuleBase) => ({
  initialize() {
    const renderer = envAdapter.getRenderer();
    renderer.xr.addEventListener("sessionstart", async () => {
      playerController.xrController.enabled = true;
    });
    renderer.xr.addEventListener("sessionend", () => {
      playerController.xrController.enabled = false;
    });
    if (renderer.xr.isPresenting) {
      playerController.xrController.enabled = true;
    }
  },
});
