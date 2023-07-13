/**
 * stores unique player session id
 * @packageDocumentation
 */
import { nanoid } from "nanoid";
import { VerseModuleBase } from "./VerseModuleBase";

export type PlayerSessionIdData = {
  playerSessionId: string;
};

/**
 * stores unique player session id
 */
export default ({ putData }: VerseModuleBase<PlayerSessionIdData>) => ({
  initialize() {
    const playerSessionId = nanoid();
    putData({ playerSessionId });
  },
});
