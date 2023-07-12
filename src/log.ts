import { VerseModuleBase } from "./VerseModuleBase";
import { PlayerNameData } from "./nameplate";
import { PlayerSessionIdData } from "./playerSessionId";

const nameCache = new Map<string, string | undefined>();

function createLog(parent: HTMLElement) {
  const $log = document.createElement("div");
  $log.style.position = "absolute";
  $log.style.bottom = "5px";
  $log.style.right = "5px";
  $log.style.width = "calc(100vw - 60px)";
  $log.style.color = "#fff";
  $log.style.textShadow = "1px 1px 1px #333";
  $log.style.textAlign = "right";
  $log.style.pointerEvents = "none";
  parent.appendChild($log);
  return $log;
}

function timestamp() {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()}`;
}

function makeLogMessage(data: PlayerSessionIdData & PlayerNameData) {
  const exists = nameCache.has(data.playerSessionId);
  if (!exists) {
    nameCache.set(data.playerSessionId, data.name);
    return `[${data.name || "<noname>"}] joined : ${timestamp()}`;
  }
  const previousName = nameCache.get(data.playerSessionId);
  if (previousName !== data.name) {
    nameCache.set(data.playerSessionId, data.name);
    return `[${previousName || "<noname>"}] -> [${
      data.name || "<noname>"
    }] renamed : ${timestamp()}`;
  }
}

export default ({
  addTextDataChangedListener,
  domRoot,
}: VerseModuleBase<{}, PlayerSessionIdData & PlayerNameData>) => ({
  initialize() {
    const $log = createLog(domRoot);

    addTextDataChangedListener((_, data) => {
      const message = makeLogMessage(data);
      if (message) {
        const $message = document.createElement("div");
        $message.textContent = message;
        $log.appendChild($message);
      }
    });
  },
});
