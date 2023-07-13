import type { OtherPerson, Player } from "@verseengine/verse-three";

/**
 * merging player.setTextData() like `player.setTextData({...previousData, ...appendData})`
 *
 * @example
 * ```ts
 * putData({ foo: 1 });
 * putData({ bar: 2 });
 * getData(); // { foo: 1, bar: 2 }
 * ```
 */
export type PutData = (appendData: Record<string, any>) => unknown;

/**
 * generate `putData()`
 *
 * @param options
 * @returns
 */
export default function ({
  player,
}: {
  player: Player | OtherPerson;
}): PutData {
  return function putData(appendData: Record<string, any>) {
    const json = player.getTextData();
    const previousData = json ? JSON.parse(json) : {};
    player.setTextData(JSON.stringify({ ...previousData, ...appendData }));
  };
}
