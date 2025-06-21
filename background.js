
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "check-AI",
    title: "Check Validity",
    contexts: ["selection"] // Only show when text is highlighted
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "check-AI") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showResultBox,
      args: [info.message] // Send the selected text to the page
    });
  }
});

function showResultBox(message) {
  const box = document.createElement("div");
  box.innerHTML = `
    <div style="
      position: fixed;
      top: 100px;
      right: 20px;
      background: white;
      border: 1px solid #ccc;
      padding: 16px;
      z-index: 9999;
      max-width: 300px;
      font-family: Arial;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15)
    ">
      <h3>🧠 AI Result</h3>
      <p>${message}</p>
      <button onclick="this.parentElement.remove()">✖ Close</button>
    </div>
  `;
  document.body.appendChild(box);
}