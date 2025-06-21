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
