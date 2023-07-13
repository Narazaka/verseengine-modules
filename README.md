# verseengine-modules

modules for verseengine/verse-three

## Install

```sh
npm i verseengine-modules
```

## Usage

```ts
import * as VerseThree from "@verseengine/verse-three";
import { initializeVerseModule } from "verseengine-modules";
import nameplate from "verseengine-modules/nameplate";
import joinSound from "verseengine-modules/joinSound";
import micStatus from "verseengine-modules/micStatus";
import playerSessionId from "verseengine-modules/playerSessionId";
import enableXrController from "verseengine-modules/enableXrController";
import enableMoveController from "verseengine-modules/enableMoveController";
import nameLog from "verseengine-modules/nameLog";
import adjustNameplatePosition from "verseengine-modules/adjustNameplatePosition";
import chat from "verseengine-modules/chat";
import { setNoname } from "verseengine-modules/util/playerName";

const domRoot = document.getElementById("app");
const envAdapter = new VerseThree.DefaultEnvAdapter();
const verseStartResult = await VerseThree.start(...);
ticks.push(verseStartResult.tick);

setNoname("<NONAME>");

const verseModule = initializeVerseModule({
  verseStartResult,
  envAdapter,
  domRoot,
});
verseModule
  .initialize(micStatus, { textureUrl: "./asset/ui/mute.png" })
  .initialize(playerSessionId)
  .initialize(nameplate, {})
  .initialize(adjustNameplatePosition)
  .initialize(joinSound, { audioSrc: "./asset/ui/join.m4a" })
  .initialize(enableXrController)
  .initialize(enableMoveController)
  .initialize(nameLog, {})
  .initialize(chat, {});
```

see [examples/src/main.ts](https://github.com/Narazaka/verseengine-modules/blob/master/examples/src/main.ts)

## Make your own module

```ts
// myModule.ts
export default ({
  addTextDataChangedListener,
}: VerseModuleBase<{}, PlayerNameData>) => ({
  initialize(options?: { prefix?: string }) {
    addTextDataChangedListener((_, data) => {
      console.log(prefix, data.name);
    });
  },
});

// main.ts etc.
import myModule from "./myModule";

verseModule
  .initialize(playerSessionId)
  .initialize(nameplate, {})
  .initialize(myModule, { prefix: "name =" });
```

## API Docs

[TypeDoc](https://narazaka.github.io/verseengine-modules/)

## License

[Zlib license](LICENSE)
