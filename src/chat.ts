import { VerseModuleBase } from "./VerseModuleBase";
import { getDefaultAddLog } from "./util/log";
import { PlayerNameData } from "./nameplate";
import { playerName } from "./util/playerName";

const chatMessageMaxLength = 200;

function createChatMessageInput(parent: HTMLElement) {
  const $button = document.createElement("button");
  $button.type = "submit";
  $button.textContent = "送信";

  const $input = document.createElement("input");
  $input.maxLength = chatMessageMaxLength;
  $input.placeholder = "チャット";

  const $form = document.createElement("form");
  $form.appendChild($input);
  $form.appendChild($button);
  $form.style.position = "absolute";
  $form.style.bottom = "5px";
  $form.style.right = "5px";
  $form.style.width = "calc(100vw - 60px)";
  $form.style.height = "25px";
  $form.style.textAlign = "right";

  $form.appendChild($input);
  $form.appendChild($button);

  parent.appendChild($form);
  return (onChange: (chatMessage: string) => unknown) => {
    const onChangeInner = (e?: SubmitEvent) => {
      e?.preventDefault();
      const chatMessage = $input.value
        .trim()
        .substring(0, chatMessageMaxLength);
      onChange(chatMessage);
    };
    onChangeInner();

    $form.addEventListener("submit", onChangeInner);
  };
}

function makeLogMessage(data: PlayerNameData & ChatMessageData) {
  if (!data.chatMessage) return undefined;
  return `[${playerName(data.name)}] ${data.chatMessage}`;
}

export type ChatMessageData = {
  chatMessage?: string;
};

export default ({
  addTextDataChangedListener,
  domRoot,
  getData,
  putData,
}: VerseModuleBase<ChatMessageData, PlayerNameData>) => ({
  initialize(options?: {
    handleChatMessage?: (
      onChatMessage: (chatMessage: string) => unknown,
    ) => unknown;
    addLog?: (message: string) => unknown;
  }) {
    const addLog = options?.addLog || getDefaultAddLog(domRoot);

    addTextDataChangedListener((_, data) => {
      const message = makeLogMessage(data);
      if (message) addLog(message);
    });

    (options?.handleChatMessage || createChatMessageInput(domRoot))(
      (chatMessage) => {
        putData({ chatMessage });
        const message = makeLogMessage({ chatMessage, name: getData().name });
        if (message) addLog(message);
      },
    );
  },
});
