chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_TEXT") {
    showResultBox(message.payload);
  }
});

// Mock AI checker logic
function mockFactCheck(text) {
  const lower = text.toLowerCase();
  if (lower.includes("5g causes cancer")) {
    return {
      result: "❌ Misinformation Detected: Scientific research has not found a link between 5G and cancer.",
      sources: [
        "https://www.who.int/news-room/q-a-detail/radiation-5g-mobile-networks-and-health"
      ]
    };
  }
  return {
    result: "✅ No obvious misinformation detected in the selected text.",
    sources: []
  };
}

// Show floating box
function showResultBox(message) {
  const { result: Finalmessage, sources } = mockFactCheck(message);
  highlightSelection();
  // Remove old box if it exists
  if (document.getElementById("ai-result-box")) {
    document.getElementById("ai-result-box").remove();
  }
  const oldBox = document.getElementById("ai-result-box");
  if (oldBox) oldBox.remove();

  const box = document.createElement("div");
  box.id = "ai-result-box";
  Object.assign(box.style, {
    position: "fixed",
    top: "80px",
    left: "100px",
    maxWidth: "360px",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    padding: "20px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    zIndex: "9999",
    fontSize: "14px",
    fontFamily: "'Poppins', sans-serif",
  });

  box.innerHTML = `
    <div id="drag-header" style="cursor: move; font-weight: bold; margin-bottom: 10px;">🧠 AI Fact Checker</div>
    <p>${Finalmessage}</p>
    ${sources.length > 0
      ? `<p><strong>Sources:</strong><br>${sources.map(s => `<a href="${s}" target="_blank">${s}</a>`).join("<br>")}</p>`
      : ""}
    <small style="color:#d63031; display:block; margin-top:10px;">⚠ AI-generated result. Please verify sources.</small>
    <button id="close-result-box" style="margin-top:10px; background-color:#ccc; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;">✖ Close</button>
  `;

  document.body.appendChild(box);

  document.getElementById("close-result-box").addEventListener("click", () => {
    removeHighlights();
    box.remove();
  });

  makeDraggable(box, document.getElementById("drag-header"));
}

function makeDraggable(element, handle) {
  let offsetX = 0, offsetY = 0, isDragging = false;

  handle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "auto";
  });
}
function highlightSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  if (selection.isCollapsed) return; // No text selected
  // Create a highlight span and insert it at the selection
  const range = selection.getRangeAt(0);
  const highlight = document.createElement("span");
  highlight.style.backgroundColor = "yellow";
  highlight.style.color = "black";
  highlight.style.padding = "2px 4px";
  highlight.appendChild(range.extractContents());
  range.insertNode(highlight);
}

function removeHighlights() {
  const highlights = document.querySelectorAll("span[style*='background-color: yellow']");
  highlights.forEach(span => {
    const parent = span.parentNode;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  });
}