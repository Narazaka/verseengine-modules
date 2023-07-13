/**
 * simple chat
 * @packageDocumentation
 */
import { VerseModuleBase } from "./VerseModuleBase";
import { getDefaultAddLog } from "./util/log";
import { PlayerNameData } from "./nameplate";
import { playerName } from "./util/playerName";
import { NameplatePositionHeightOptions } from "./util/graphic/namePlatePositionHeight";
import { TextTextureOptions } from "./util/graphic/getTextTextureCanvas";
import { getOrAddSprite } from "./util/graphic/getOrAddSprite";
import { getOrAddNameplateContainer } from "./util/graphic/getOrAddNameplateContainer";
import { createTextSpriteData } from "./util/graphic/createTextSpriteData";
import { drawRoundedRectPath } from "./util/graphic/drawRoundedRectPath";

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

function makeLogMessage(
  data: PlayerNameData & Required<ChatMessageData>,
): string;
function makeLogMessage(
  data: PlayerNameData & { chatMessage?: undefined },
): undefined;
function makeLogMessage(
  data: PlayerNameData & ChatMessageData,
): string | undefined;
function makeLogMessage(data: PlayerNameData & ChatMessageData) {
  if (!data.chatMessage) return undefined;
  return `[${playerName(data.name)}] ${data.chatMessage}`;
}

export type ChatBalloonTextTexrureOptions = TextTextureOptions & {
  borderRadius?: number;
};

function handleChatBalloon(
  parent: THREE.Object3D,
  avatarObject: THREE.Object3D,
  text: string | undefined,
  options?: {
    nameplatePositionHeightOptions?: NameplatePositionHeightOptions;
    textTextureOptions?: ChatBalloonTextTexrureOptions;
  },
) {
  let exists = false;
  const balloon = getOrAddSprite(
    getOrAddNameplateContainer(
      parent,
      avatarObject,
      options?.nameplatePositionHeightOptions,
    ),
    "chatBalloon",
    {
      afterCreate: (s) => {
        s.position.y = 0.4;
      },
      afterExists: () => {
        exists = true;
      },
    },
  );

  if (!text) {
    balloon.visible = false;
    return;
  }

  balloon.visible = true;

  const { material, scale } = createTextSpriteData(text, balloon.id, {
    font: "108px sans-serif",
    style: "#333333",
    backgroundStyle: "rgba(255, 255, 255, 0.6)",
    onBackground(ctx) {
      drawRoundedRectPath(
        ctx,
        1,
        1,
        ctx.canvas.width - 2,
        ctx.canvas.height - 2,
        options?.textTextureOptions?.borderRadius || 30,
      );
      ctx.fill();
    },
    ...options?.textTextureOptions,
  });
  if (exists) {
    balloon.material.map?.dispose();
    balloon.material.dispose();
  }
  balloon.material = material;
  balloon.scale.set(scale.x, scale.y, scale.z);
}

export type ChatMessageData = {
  chatMessage?: string;
};

/**
 * simple chat
 */
export default ({
  addTextDataChangedListener,
  domRoot,
  getData,
  putData,
  player,
}: VerseModuleBase<ChatMessageData, PlayerNameData>) => ({
  initialize(options?: {
    handleChatMessage?: (
      onChatMessage: (chatMessage: string) => unknown,
    ) => unknown;
    addLog?: ((message: string) => unknown) | false;
    balloon?:
      | true
      | {
          /**
           * displays local player's chat balloon
           *
           * @default true
           */
          local?: boolean;
          /**
           * nameplate position height options
           */
          nameplatePositionHeightOptions?: NameplatePositionHeightOptions;
          /**
           * chat balloon texture options
           */
          textTextureOptions?: ChatBalloonTextTexrureOptions;
        };
  }) {
    const addLog =
      options?.addLog === false
        ? undefined
        : options?.addLog || getDefaultAddLog(domRoot);
    const balloonOption = options?.balloon === true ? {} : options?.balloon;

    addTextDataChangedListener((otherPerson, data) => {
      if (data.chatMessage) {
        if (addLog) {
          const message = makeLogMessage(data);
          addLog(message!);
        }
      }
      if (balloonOption) {
        handleChatBalloon(
          otherPerson.object3D,
          otherPerson.avatar?.object3D,
          data.chatMessage,
          balloonOption,
        );
      }
    });

    (options?.handleChatMessage || createChatMessageInput(domRoot))(
      (chatMessage) => {
        putData({ chatMessage });
        if (chatMessage) {
          if (addLog) {
            const message = makeLogMessage({
              chatMessage,
              name: getData().name,
            });
            addLog(message);
          }
        }
        if (balloonOption && balloonOption.local !== false) {
          handleChatBalloon(
            player.object3D,
            player.avatar?.object3D,
            chatMessage,
            balloonOption,
          );
        }
      },
    );
  },
});
