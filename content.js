chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_TEXT") {
    FactCheck(message.payload);
  }
});

// AI checker logic
async function mockFactCheck(text) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: [{
        role: "user",
        content: `You're a fact-checking assistant.use only 15 words . Follow this format so i can easily implement it with this code(    const resultText = data.choices?.[0]?.message?.content || "⚠️ No response from AI.";
    console.log("✅ AI Response:", data);
):\n\n"${text}"`
      }],
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
  const resultText = data.choices ?.[0]?.message?.content || "⚠️ No response from AI.";
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
  box.id = "ai-result-box"; // Apply styles by ID

  box.innerHTML = `
    <div id="drag-header">🧠 AI Fact Checker</div>
    <p>${Finalmessage}</p>
    ${sources.length > 0
      ? `<p><strong>Sources:</strong><br>${sources.map(s => `<a href="${s}" target="_blank">${s}</a>`).join("<br>")}</p>`
      : ""}
    <small>⚠ AI-generated result. Please verify sources.</small>
    <button id="close-result-box">✖ Close</button>
  `;

  document.body.appendChild(box);

  document.getElementById("close-result-box").addEventListener("click", () => {
    removeHighlights();
    box.remove();
  });

  makeDraggable(box, document.getElementById("drag-header"));
}

function makeDraggable(element, handle) {
  let offsetX = 0,
    offsetY = 0,
    isDragging = false;

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
  if (!selection.rangeCount || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const highlight = document.createElement("span");
  // Add a class instead of specifying styles directly
  highlight.className = "ai-checker-highlight";
  highlight.appendChild(range.extractContents());
  range.insertNode(highlight);
}

function removeHighlights() {
  // Find highlighted elements by class name
  const highlights = document.querySelectorAll("span.ai-checker-highlight");
  highlights.forEach(span => {
    const parent = span.parentNode;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  });
}


function removeHighlights() {
  // Find highlighted elements by class name
  const highlights = document.querySelectorAll("span.ai-checker-highlight");
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

  waitBox.innerHTML = `
    <div class="ai-checker-spinner"></div>
    <div class="ai-checker-loading-text">Analyzing...</div>
  `;
  document.body.appendChild(waitBox);
}


