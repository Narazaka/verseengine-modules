/**
 * simple join sound
 * @packageDocumentation
 */
import type { VerseModuleBase } from "./VerseModuleBase";
import { PlayerSessionIdData } from "./playerSessionId";
import { createCachedAudio } from "./util/cachedAudio";

/** @internal */
const { getAudio, createAudio } = createCachedAudio();

const ids = new Set<string>();

/** @internal */
export function handleJoinSound(id: string) {
  if (ids.has(id)) return;
  ids.add(id);
  getAudio()?.play();
}

/**
 * simple join sound
 */
export default ({
  addTextDataChangedListener,
  domRoot,
}: VerseModuleBase<{}, PlayerSessionIdData>) => ({
  initialize(options: { audioSrc: string; volume?: number }) {
    createAudio(domRoot, options.audioSrc, options.volume);
    addTextDataChangedListener((_, data) => {
      handleJoinSound(data.playerSessionId);
    });
  },
});
