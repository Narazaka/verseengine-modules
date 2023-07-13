import type { OtherPerson, Player } from "@verseengine/verse-three";

/**
 * parsed `player.getTextData()`
 */
export type GetData = () => any;

/**
 * generate `getData()`
 *
 * @param options
 * @returns
 */
export default function ({
  player,
}: {
  player: Player | OtherPerson;
}): GetData {
  return function getData() {
    const json = player.getTextData();
    return json ? JSON.parse(json) : {};
  };
}
