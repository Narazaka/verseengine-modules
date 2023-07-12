export function isMobile() {
  if (
    "userAgentData" in navigator &&
    navigator.userAgentData &&
    (navigator.userAgentData as any).mobile
  ) {
    return true;
  } else {
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
      return true;
    } else {
      return false;
    }
  }
}
