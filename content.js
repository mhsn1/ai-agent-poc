// background.js

console.log("🟢 Service-worker loaded");
chrome.runtime.onMessage.addListener((msg) => {
  console.log("🎯 Extension triggered!", msg);
});

// content.js – SIRF itna hi code rakho

console.log("🟢 content.js injected on", location.href);

window.addEventListener("message", (e) => {
  if (e.data?.type === "RUN_AGENT") {
    console.log("📤 Relay to BG:", e.data);
    chrome.runtime.sendMessage(e.data);
  }
});
