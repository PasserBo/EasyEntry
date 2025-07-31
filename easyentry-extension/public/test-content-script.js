// MINIMAL TEST - Content script
console.log("BASIC TEST: Content script loaded on:", window.location.href);

// Add a visible element to the page
const testDiv = document.createElement('div');
testDiv.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  padding: 10px;
  z-index: 10000;
  font-family: Arial;
  font-size: 14px;
`;
testDiv.textContent = "EasyEntry Extension Test: Content Script Loaded!";
document.body.appendChild(testDiv);

// Test Chrome runtime
console.log("BASIC TEST: Chrome runtime available:", !!chrome.runtime);

// Try to send message to background
chrome.runtime.sendMessage({type: "TEST"}, (response) => {
  console.log("BASIC TEST: Background response:", response);
}); 