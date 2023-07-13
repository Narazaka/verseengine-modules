import "./style.css";
import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { setupVerse } from "./setup-verse";
import type { Tick } from "./Tick";
import { setupScene } from "./setupScene";
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

function main() {
  const domRoot = document.getElementById("app")!;

  const ticks: Tick[] = [];
  const { scene, renderer, camera, ground } = setupScene(domRoot, ticks);

  // プレイヤーの作成
  const cameraContainer = new THREE.Object3D(); // 頭
  cameraContainer.add(camera);
  const player = new THREE.Object3D(); // プレイヤー本体
  player.add(cameraContainer);
  scene.add(player);
  camera.position.set(0.0, 1.6, 0); // カメラ位置を頭のデフォルトの高さに設定

  // VRコントローラでテレポートする対象
  const teleportTargetObjects = [ground];
  // 地面と障害物
  const collisionBoxes = [new THREE.Box3().setFromObject(ground)];

  setupVerse(
    scene,
    renderer,
    camera,
    cameraContainer,
    player,
    collisionBoxes,
    teleportTargetObjects,
  ).then(({ verseStartResult, envAdapter }) => {
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
  });

  if ("xr" in navigator && navigator.xr) {
    navigator.xr.isSessionSupported("immersive-vr").then(function (supported) {
      if (supported) {
        renderer.xr.enabled = true;

        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape") {
            if (renderer.xr.isPresenting) {
              renderer.xr.getSession()?.end();
            }
          }
        });
        const vrButton = VRButton.createButton(renderer);
        document.body.appendChild(vrButton);
      }
    });
  } else {
    if (window.isSecureContext === false) {
      console.warn("webxr needs https");
    } else {
      console.warn("webxr not available");
    }
  }
}

document.addEventListener("DOMContentLoaded", main);
