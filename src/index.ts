/**
 * initialize verseModule
 * @packageDocumentation
 */
import type { EnvAdapter, VerseStartResult } from "@verseengine/verse-three";
import type { GenerateInitializable, VerseModuleBase } from "./VerseModuleBase";
import putData from "./util/putData";
import getData from "./util/getData";

/**
 * initialize verseModule
 *
 * @param options
 */
export function initializeVerseModule({
  verseStartResult,
  envAdapter,
  domRoot,
}: {
  /** return value of `await VerseThree.start()` */
  verseStartResult: VerseStartResult;
  /** `new VerseThree.DefaultEnvAdapter()` etc. */
  envAdapter: EnvAdapter;
  /** DOM element to attach some controls */
  domRoot: HTMLElement;
}) {
  const base: VerseModuleBase = {
    ...verseStartResult,
    envAdapter,
    domRoot,
    getData: getData(verseStartResult),
    putData: putData(verseStartResult),
    textDataChangedListeners: [],
    avatarChangedListeners: [],
    otherPersonAvatarChangedListeners: [],
    with(gen, cb) {
      const res = gen(this as any);
      if (cb) cb(res);
      return this as any;
    },
    initialize<D extends Record<string, any>, O>(
      gen: GenerateInitializable<D, {}, O>,
      options: O,
    ) {
      gen(this as any).initialize(options);
      return this as any;
    },
    addTextDataChangedListener(listener) {
      this.textDataChangedListeners.push(listener);
    },
  };
  base.with = base.with.bind(base);
  base.initialize = base.initialize.bind(base);
  base.addTextDataChangedListener = base.addTextDataChangedListener.bind(base);

  envAdapter.addTextDataChangedListener((otherPerson, textData) => {
    const data = textData ? JSON.parse(textData) : {};
    for (let i = 0; i < base.textDataChangedListeners.length; ++i)
      base.textDataChangedListeners[i](otherPerson, data);
  });
  envAdapter.addAvatarChangedListener((avatar) => {
    for (let i = 0; i < base.avatarChangedListeners.length; ++i)
      base.avatarChangedListeners[i](avatar);
  });
  envAdapter.addOtherPersonAvatarChangedListener((otherPerson) => {
    for (let i = 0; i < base.otherPersonAvatarChangedListeners.length; ++i)
      base.otherPersonAvatarChangedListeners[i](otherPerson);
  });

  return base;
}
