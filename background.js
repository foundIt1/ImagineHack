chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "check-AI",
    title: "Check Validity",
    contexts: ["selection"] // Only when text is selected
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "check-AI") {
    chrome.tabs.sendMessage(tab.id, {
      type: "CHECK_TEXT",
      payload: info.selectionText
    });
  }
});