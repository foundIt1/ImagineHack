//fix the highlight issue
//make the interface more presentable
//find a name for the extension
//make the text more displayable
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_TEXT") {
    FactCheck (message.payload);
  }
});

//  AI checker logic
async function mockFactCheck(text) {

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
       model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: [
        {
          role: "user",
          content: `You're a fact-checking assistant.use only 15 words . Follow this format so i can easily implement it with this code(    const resultText = data.choices?.[0]?.message?.content || "⚠️ No response from AI.";
    console.log("✅ AI Response:", data);
):\n\n"${text}"`
        }
      ],
      temperature: 0.7
    })
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ API Error:", response.status, errText);
      return {
        result: `⚠️ API error (${response.status}): ${errText}`,
        sources: []
      };
    }
    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content || "⚠️ No response from AI.";
    console.log("✅ AI Response:", data);

    return {
      result: resultText,
      sources: []
    }
}

// Function to handle the fact-checking logic
async function FactCheck(text) {
  WaitScreen(); // Show loading
  const result = await mockFactCheck(text); // Call API
  document.getElementById("wait-screen")?.remove(); // Hide loading
  showResultBox(result.result, result.sources); // Show result popup
}

// Show floating box
function showResultBox(Finalmessage, sources = []) {
  highlightSelection();

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
function WaitScreen() {
    const waitBox = document.createElement("div");
    waitBox.id = "wait-screen";
    Object.assign(waitBox.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "9999"
    });
    waitBox.innerHTML = `<div style="color: white; font-size: 20px;">🔄 Loading...</div>`;
    document.body.appendChild(waitBox);
  }
