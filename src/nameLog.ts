/**
 * displays join / name changed log
 * @packageDocumentation
 */
import { VerseModuleBase } from "./VerseModuleBase";
import { getDefaultAddLog } from "./util/log";
import { PlayerNameData } from "./nameplate";
import { PlayerSessionIdData } from "./playerSessionId";
import { playerName } from "./util/playerName";

const nameCache = new Map<string, string | undefined>();

function makeLogMessage(data: PlayerSessionIdData & PlayerNameData) {
  const exists = nameCache.has(data.playerSessionId);
  if (!exists) {
    nameCache.set(data.playerSessionId, data.name);
    return `[${playerName(data.name)}] joined`;
  }
  const previousName = nameCache.get(data.playerSessionId);
  if (previousName !== data.name) {
    nameCache.set(data.playerSessionId, data.name);
    return `[${playerName(previousName)}] -> [${playerName(
      data.name,
    )}] renamed`;
  }
}

/**
 * displays join / name changed log
 */
export default ({
  addTextDataChangedListener,
  domRoot,
}: VerseModuleBase<{}, PlayerSessionIdData & PlayerNameData>) => ({
  initialize(options?: { addLog?: (message: string) => unknown }) {
    const addLog = options?.addLog || getDefaultAddLog(domRoot);

    addTextDataChangedListener((_, data) => {
      const message = makeLogMessage(data);
      if (message) {
        addLog(message);
      }
    });
  },
});
