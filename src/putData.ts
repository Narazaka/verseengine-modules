import type { VerseStartResult } from "@verseengine/verse-three";

export default function ({ player }: VerseStartResult) {
  return function putData(appendData: Record<string, any>) {
    const json = player.getTextData();
    const previousData = json ? JSON.parse(json) : {};
    player.setTextData(JSON.stringify({ ...previousData, ...appendData }));
  };
}
