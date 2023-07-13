export function createCachedAudio() {
  let $audioCache: HTMLAudioElement | undefined;

  return {
    createAudio(parent: HTMLElement, audioSrc: string, volume = 0.03) {
      if ($audioCache) return $audioCache;
      const $audio = document.createElement("audio");
      $audio.preload = "auto";
      $audio.src = audioSrc;
      $audio.volume = volume;
      parent.appendChild($audio);
      $audioCache = $audio;
      return $audio;
    },
    getAudio() {
      return $audioCache;
    },
  };
}
