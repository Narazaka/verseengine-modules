import { nanoid } from "nanoid";
import { VerseModuleBase } from "./VerseModuleBase";

export type PlayerSessionIdData = {
  playerSessionId: string;
};

export default ({ putData }: VerseModuleBase<PlayerSessionIdData>) => ({
  initialize() {
    const playerSessionId = nanoid();
    putData({ playerSessionId });
  },
});
