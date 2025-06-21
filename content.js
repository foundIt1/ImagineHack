document.addEventListener("mouseup", () => { 
  const selectedText = window.getSelection().toString().trim(); 
  if (selectedText.length > 5) { 
    chrome.runtime.sendMessage({ type: "verifyText", text: selectedText }); 
  } 
}); 

chrome.runtime.onMessage.addListener((message) => { 
  if (message.type === "resultFromAI") { 
    alert(message.result); // Simple alert for now 
  } 
}); 
