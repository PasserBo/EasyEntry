// MINIMAL TEST - Background script with proper API waiting
console.log("BASIC TEST: Background script starting...");

// Wait for Chrome APIs to be available
chrome.runtime.onStartup.addListener(() => {
  console.log("BASIC TEST: Extension startup event triggered");
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("BASIC TEST: Extension installed/updated");
  initializeExtension();
});

// Initialize when APIs are ready
function initializeExtension() {
  console.log("BASIC TEST: Initializing extension with Chrome APIs");
  
  try {
    // Test if chrome.action is available
    if (chrome.action) {
      chrome.action.setBadgeText({text: "ON"});
      chrome.action.setBadgeBackgroundColor({color: "green"});
      console.log("BASIC TEST: Badge should be visible on extension icon");
    } else {
      console.error("BASIC TEST: chrome.action is not available");
    }
    
    // Test storage
    if (chrome.storage) {
      chrome.storage.local.set({testKey: "testValue"}, () => {
        if (chrome.runtime.lastError) {
          console.error("BASIC TEST: Storage error:", chrome.runtime.lastError);
        } else {
          console.log("BASIC TEST: Storage test completed successfully");
        }
      });
    } else {
      console.error("BASIC TEST: chrome.storage is not available");
    }
  } catch (error) {
    console.error("BASIC TEST: Error in initialization:", error);
  }
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("BASIC TEST: Background received message:", message);
  sendResponse({received: true, timestamp: Date.now()});
});

// Try to initialize immediately if APIs are already available
if (chrome.runtime && chrome.action && chrome.storage) {
  console.log("BASIC TEST: Chrome APIs already available, initializing now");
  initializeExtension();
} else {
  console.log("BASIC TEST: Waiting for Chrome APIs to become available...");
} 