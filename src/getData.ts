import type { VerseStartResult } from "@verseengine/verse-three";

export default function ({ player }: VerseStartResult) {
  return function getData() {
    const json = player.getTextData();
    return json ? JSON.parse(json) : {};
  };
}
