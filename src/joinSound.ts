/**
 * simple join sound
 * @packageDocumentation
 */
import type { VerseModuleBase } from "./VerseModuleBase";
import { PlayerSessionIdData } from "./playerSessionId";

let $audioCache: HTMLAudioElement | undefined;

/** @internal */
export function createJoinAudio(parent: HTMLElement, audioSrc: string) {
  if ($audioCache) return $audioCache;
  const $audio = document.createElement("audio");
  $audio.preload = "auto";
  $audio.src = audioSrc;
  $audio.volume = 0.03;
  parent.appendChild($audio);
  $audioCache = $audio;
  return $audio;
}

const ids = new Set<string>();

/** @internal */
export function handleJoinSound(id: string) {
  if (ids.has(id)) return;
  ids.add(id);
  $audioCache?.play();
}

/**
 * simple join sound
 */
export default ({
  addTextDataChangedListener,
  domRoot,
}: VerseModuleBase<{}, PlayerSessionIdData>) => ({
  initialize(options: { audioSrc: string }) {
    createJoinAudio(domRoot, options.audioSrc);
    addTextDataChangedListener((_, data) => {
      handleJoinSound(data.playerSessionId);
    });
  },
});
