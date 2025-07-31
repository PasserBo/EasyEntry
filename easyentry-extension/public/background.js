// Background script (service worker) for EasyEntry extension
console.log("🚀 EasyEntry background script loaded.");

// --- ICON MANAGEMENT ---
// Functions to provide visual feedback to the user.
const setIconToActive = () => {
  if (chrome.action) {
    chrome.action.setBadgeText({ text: "✓" });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
    console.log("🟢 Background: Set icon to active state");
  }
};

const setIconToInactive = () => {
  if (chrome.action) {
    chrome.action.setBadgeText({ text: "" });
    console.log("⚫ Background: Set icon to inactive state");
  }
};

// --- SESSION MANAGEMENT ---
// On message, handle login/logout events.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📨 Background: Received message:", message);

  if (message.type === "LOGIN_SUCCESS") {
    console.log("✅ Background: Login success, received user data:", message.payload);
    // Store the user object from the web app into the extension's local storage.
    // This is now our extension's "session".
    chrome.storage.local.set({ loggedInUser: message.payload }, () => {
      if (chrome.runtime.lastError) {
        console.error("❌ Background: Error saving user session:", chrome.runtime.lastError);
        sendResponse({ status: "error", error: chrome.runtime.lastError });
      } else {
        setIconToActive();
        console.log("✅ Background: User session saved successfully");
        sendResponse({ status: "success" });
      }
    });
    return true; // Asynchronous response
  }

  if (message.type === "LOGOUT_SUCCESS") {
    console.log("🚪 Background: Logout success message received.");
    // Clear the user session from the extension's storage.
    chrome.storage.local.remove('loggedInUser', () => {
      if (chrome.runtime.lastError) {
        console.error("❌ Background: Error clearing user session:", chrome.runtime.lastError);
        sendResponse({ status: "error", error: chrome.runtime.lastError });
      } else {
        setIconToInactive();
        console.log("✅ Background: User session cleared successfully");
        sendResponse({ status: "success" });
      }
    });
    return true; // Asynchronous response
  }

  // Handle test messages
  if (message.type === "MANUAL_TEST" || message.type === "TEST") {
    console.log("🧪 Background: Test message received:", message);
    sendResponse({ 
      received: true, 
      backgroundActive: true,
      timestamp: Date.now(),
      message: "Background script is working!"
    });
    return;
  }

  // Handle content script loaded confirmation
  if (message.type === "CONTENT_SCRIPT_LOADED") {
    console.log("📋 Background: Content script loaded confirmation from:", message.url);
    sendResponse({ 
      received: true, 
      backgroundActive: true,
      timestamp: Date.now()
    });
    return;
  }

  // Handle other message types
  console.log("ℹ️ Background: Unhandled message type:", message.type);
  sendResponse({ received: false });
});

// Initialize icon state when extension starts
const initializeIconState = () => {
  chrome.storage.local.get(['loggedInUser'], (result) => {
    if (chrome.runtime.lastError) {
      console.error("❌ Background: Error checking initial login state:", chrome.runtime.lastError);
    } else {
      console.log("🔍 Background: Checking initial login state:", result);
      if (result.loggedInUser) {
        console.log("👤 Background: Found existing user session:", result.loggedInUser.email);
        setIconToActive();
      } else {
        console.log("👤 Background: No existing user session found");
        setIconToInactive();
      }
    }
  });
};

// Check initial login state when the browser starts
chrome.runtime.onStartup.addListener(() => {
  console.log("🔄 Background: Extension startup event");
  initializeIconState();
});

// Also check on install/update
chrome.runtime.onInstalled.addListener(() => {
  console.log("📦 Background: Extension installed/updated");
  initializeIconState();
});

// Initialize immediately if APIs are available
if (chrome.runtime && chrome.storage) {
  console.log("🚀 Background: APIs available, initializing immediately");
  initializeIconState();
} 