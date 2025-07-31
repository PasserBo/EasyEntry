console.log("🌐 EasyEntry communication script injected into web app at:", window.location.href);
console.log("🔍 Content script test: Chrome runtime available:", !!chrome.runtime);

// Test if we can communicate with the background script
chrome.runtime.sendMessage({ 
  type: "CONTENT_SCRIPT_LOADED",
  url: window.location.href,
  timestamp: Date.now()
}, (response) => {
  if (chrome.runtime.lastError) {
    console.error("❌ Content Script: Failed to communicate with background:", chrome.runtime.lastError);
  } else {
    console.log("✅ Content Script: Successfully communicated with background:", response);
  }
});

// Listen for messages from the web app page
window.addEventListener("message", (event) => {
  console.log("👂 Content Script: Received window message:", {
    type: event.data.type,
    origin: event.origin,
    source: event.source === window ? 'same-window' : 'other',
    data: event.data
  });
  
  // We only accept messages from ourselves (same origin)
  if (event.source !== window) {
    console.log("🚫 Content Script: Ignoring message from different source");
    return;
  }

  // Check for both LOGIN and LOGOUT messages
  if (event.data.type && (event.data.type === "LOGIN_SUCCESS" || event.data.type === "LOGOUT_SUCCESS")) {
    console.log("🎉 Content Script: Detected", event.data.type, "- forwarding to background script");
    
    // Forward the entire message object including payload
    chrome.runtime.sendMessage(event.data, (response) => {
      if (chrome.runtime.lastError) {
        console.error("❌ Content Script: Failed to notify background script:", chrome.runtime.lastError);
      } else {
        console.log("✅ Content Script: Successfully notified background script:", response);
      }
    });
  } else if (event.data.type) {
    console.log("ℹ️ Content Script: Received other message type:", event.data.type);
  }
});

// Optional: Let the web app know the extension is installed
console.log("📢 Content Script: Announcing extension presence to web app");
window.postMessage({ 
  type: "EASYENTRY_EXTENSION_READY",
  version: "0.1.0",
  timestamp: Date.now()
}, "*");

// Test message sending capabilities
console.log("🧪 Content Script: Testing message posting to window");
setTimeout(() => {
  window.postMessage({ 
    type: "EASYENTRY_TEST_MESSAGE",
    message: "Test from content script",
    timestamp: Date.now()
  }, "*");
}, 1000); 