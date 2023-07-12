import * as VerseThree from "@verseengine/verse-three";
import type {
  Box3,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Event,
} from "three";

import VERSE_WASM_URL from "@verseengine/verse-three/dist/verse_core_bg.wasm";
const ENTRANCE_SERVER_URL = "https://entrance.verseengine.cloud";
// アニメーションファイル
const ANIMATION_MAP = {
  idle: "./asset/verse-three/example/asset/animation/idle.fbx",
  walk: "./asset/verse-three/example/asset/animation/walk.fbx",
};
// アバターファイル
const range = (n: number) => [...Array(n).keys()];
export const PRESET_AVATARS = [
  ...range(3).map((i) => `f${i}`),
  ...range(3).map((i) => `m${i}`),
].map((n) => ({
  thumbnailURL: `./asset/verse-three/example/asset/avatar/${n}.png`,
  avatarURL: `./asset/verse-three/example/asset/avatar/${n}.vrm`,
}));

const DEFAULT_AVATAR_URL =
  PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)].avatarURL;
// WebRTC RTCIceServers
const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export const setupVerse = async (
  scene: Scene,
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  cameraContainer: Object3D<Event>,
  player: Object3D<Event>,
  collisionBoxes: Box3[],
  teleportTargetObjects: Object3D<Event>[],
) => {
  const adapter = new VerseThree.DefaultEnvAdapter(
    renderer,
    scene,
    camera,
    cameraContainer,
    player,
    () => collisionBoxes,
    () => [], // 壁などの障害物(今回は未指定)
    () => teleportTargetObjects,
    { isLowSpecMode: false }, // 髪などの揺れを省略してパフォーマンスを改善する
  );
  const mayBeLowSpecDevice = VerseThree.isLowSpecDevice();
  const res = await VerseThree.start(
    adapter,
    scene,
    VERSE_WASM_URL,
    ENTRANCE_SERVER_URL,
    DEFAULT_AVATAR_URL,
    ANIMATION_MAP,
    ICE_SERVERS,
    {
      maxNumberOfPeople: mayBeLowSpecDevice ? 8 : 16,
      maxNumberOfParallelFileTransfers: mayBeLowSpecDevice ? 1 : 4,
      presetAvatars: PRESET_AVATARS,
    },
  );
  res.guiHandlers.setVoiceVolume(1);
  return { verseStartResult: res, envAdapter: adapter };
};
