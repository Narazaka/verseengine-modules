import type {
  EnvAdapter,
  OtherPerson,
  VerseStartResult,
} from "@verseengine/verse-three";

export type TextDataChangedListener<D extends Record<string, any>> = (
  otherPerson: OtherPerson,
  data: D,
) => unknown;

export type GenerateInitializable<
  D extends Record<string, any>,
  RequireData extends Record<string, any>,
  O,
> = (base: VerseModuleBase<D, RequireData>) => Initializable<O>;

export type Initializable<O> = {
  initialize(options: O): unknown;
};

export type VerseModuleBase<
  Data extends Record<string, any> = {},
  RequireData extends Record<string, any> = {},
> = VerseStartResult & {
  envAdapter: EnvAdapter;
  domRoot: HTMLElement;
  getData(): Data & RequireData;
  putData(appendData: Partial<Data>): void;
  textDataChangedListeners: TextDataChangedListener<any>[];
  avatarChangedListeners: Parameters<
    EnvAdapter["addAvatarChangedListener"]
  >[0][];
  otherPersonAvatarChangedListeners: Parameters<
    EnvAdapter["addOtherPersonAvatarChangedListener"]
  >[0][];
  addTextDataChangedListener(
    listener: TextDataChangedListener<Data & RequireData>,
  ): void;
  with<D extends Record<string, any>, O>(
    gen: GenerateInitializable<D, Data, O>,
    cb?: (initializable: Initializable<O>) => unknown,
  ): VerseModuleBase<Data & D, Data & D>;
  initialize<D extends Record<string, any>>(
    gen: GenerateInitializable<D, Data, void>,
    options?: void,
  ): VerseModuleBase<Data & D, Data & D>;
  initialize<D extends Record<string, any>, O>(
    gen: GenerateInitializable<D, Data, O>,
    options: O,
  ): VerseModuleBase<Data & D, Data & D>;
};
