console.log("🟢 Service-worker loaded"); 

chrome.runtime.onMessage.addListener((msg) => {
    console.log("🎯 Extension triggered!", msg);
  });
self.addEventListener('message', async (e) => {
    if (e.data?.type === 'RUN_AGENT') {
      console.log('🎯 Trigger received, starting real tasks…');
  
      // ✨  PLACE REAL EXTENSION STEPS HERE  ✨
      // Example: click a button on the page
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // This runs in the page context
          const btn = document.querySelector('#submit');
          btn?.click();
        }
      });
    }
  });
  