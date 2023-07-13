import type {
  EnvAdapter,
  OtherPerson,
  VerseStartResult,
} from "@verseengine/verse-three";

/** {@link EnvAdapter.addTextDataChangedListener} with typed data */
export type TextDataChangedListener<D extends Record<string, any>> = (
  otherPerson: OtherPerson,
  data: D,
) => unknown;

/**
 * the module
 */
export type GenerateInitializable<
  D extends Record<string, any>,
  RequireData extends Record<string, any>,
  O,
> = (base: VerseModuleBase<D, RequireData>) => Initializable<O>;

/**
 * module should return this
 */
export type Initializable<O> = {
  initialize(options: O): unknown;
};

export type VerseModuleBase<
  Data extends Record<string, any> = {},
  RequireData extends Record<string, any> = {},
> = VerseStartResult & {
  envAdapter: EnvAdapter;
  /**
   * DOM element to attach some controls
   *
   * @category Module creation
   *
   * @example
   * ```ts
   * domRoot.appendChild(myDiv);
   * ```
   */
  domRoot: HTMLElement;
  /** parsed player.getTextData() */
  getData(): Data & RequireData;
  /**
   * merging player.setTextData() like `player.setTextData({...previousData, ...appendData})`
   *
   * @category Module creation
   *
   * @example
   * ```ts
   * putData({ foo: 1 }); // { foo: 1 }
   * putData({ bar: 2 }); // { foo: 1, bar: 2 }
   * getData(); // { foo: 1, bar: 2 }
   * ```
   */
  putData(appendData: Partial<Data>): Data;
  /**
   * @see {@link addTextDataChangedListener}
   *
   * @category Module creation
   */
  textDataChangedListeners: TextDataChangedListener<any>[];
  /**
   * {@link EnvAdapter.addTextDataChangedListener}
   *
   * @category Module creation
   *
   * @example
   * ```ts
   * avatarChangedListeners.push((avatar) => {
   *   const meta = player.avatar.vrm?.meta
   *   console.log(`changed to ${meta?.metaVersion === "0" ? meta.title : meta?.name}`);
   * });
   * ```
   */
  avatarChangedListeners: Parameters<
    EnvAdapter["addAvatarChangedListener"]
  >[0][];
  /**
   * {@link EnvAdapter.addOtherPersonAvatarChangedListener}
   *
   * @category Module creation
   *
   * @example
   * ```ts
   * otherPersonAvatarChangedListeners.push((otherPerson) => {
   *   const meta = otherPerson.avatar?.vrm?.meta
   *   console.log(`changed to ${meta?.metaVersion === "0" ? meta.title : meta?.name}`);
   * });
   * ```
   */
  otherPersonAvatarChangedListeners: Parameters<
    EnvAdapter["addOtherPersonAvatarChangedListener"]
  >[0][];
  /**
   * {@link EnvAdapter.addTextDataChangedListener}
   *
   * @category Module creation
   *
   * @example
   * ```ts
   * addTextDataChangedListener((otherPerson, data) => {
   *   console.log(data);
   * });
   * ```
   */
  addTextDataChangedListener(
    listener: TextDataChangedListener<Data & RequireData>,
  ): void;
  /**
   * initialize a module
   *
   * @category General use
   *
   * @example
   * ```ts
   * verseModule.with(micStatus, ({ initialize }) =>
   *   initialize({ textureUrl: "./asset/ui/mute.png" }),
   * )
   * ```
   */
  with<D extends Record<string, any>, O>(
    gen: GenerateInitializable<D, Data, O>,
    cb?: (initializable: Initializable<O>) => unknown,
  ): VerseModuleBase<Data & D, Data & D>;
  /**
   * initialize a module
   *
   * @category General use
   *
   * @example
   * ```ts
   * verseModule.initialize(adjustNameplatePosition)
   * ```
   */
  initialize<D extends Record<string, any>>(
    gen: GenerateInitializable<D, Data, void>,
    options?: void,
  ): VerseModuleBase<Data & D, Data & D>;
  /**
   * initialize a module
   *
   * @category General use
   *
   * @example
   * ```ts
   * verseModule.initialize(micStatus, { textureUrl: "./asset/ui/mute.png" })
   * ```
   */
  initialize<D extends Record<string, any>, O>(
    gen: GenerateInitializable<D, Data, O>,
    options: O,
  ): VerseModuleBase<Data & D, Data & D>;
};
