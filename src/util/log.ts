import { timestampString } from "./timestampString";

export function createLogContainer() {
  const $log = document.createElement("div");
  $log.style.position = "absolute";
  $log.style.bottom = "35px";
  $log.style.right = "5px";
  $log.style.width = "calc(100vw - 60px)";
  $log.style.color = "#fff";
  $log.style.textShadow = "1px 1px 1px #333";
  $log.style.textAlign = "right";
  $log.style.pointerEvents = "none";
  return $log;
}

export function makeAddLog(logContainer: HTMLElement) {
  return function addLog(
    message: string | Node,
    timestamp?: false | Date | string,
  ) {
    if (typeof message !== "string") {
      logContainer.appendChild(message);
      return;
    }
    const $message = document.createElement("div");
    let line = message;
    if (timestamp !== false) {
      if (typeof timestamp === "string") {
        line += ` [${timestamp}]`;
      } else {
        line += ` [${timestampString(timestamp)}]`;
      }
    }
    $message.textContent = line;
    logContainer.appendChild($message);
  };
}

let defaultAddLog:
  | ((message: string | Node, timestamp?: false | Date | string) => unknown)
  | undefined;

export function getDefaultAddLog(domRoot: HTMLElement) {
  if (defaultAddLog) return defaultAddLog;
  const $log = createLogContainer();
  domRoot.appendChild($log);
  defaultAddLog = makeAddLog($log);
  return defaultAddLog;
}
