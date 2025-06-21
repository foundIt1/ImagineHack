//fix the highlight issue
//make the interface more presentable
//find a name for the extension
//make the text more displayable
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_TEXT") {
    FactCheck(message.payload);
  }
});

// AI Checker Logic
async function mockFactCheck(text) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer sk-or-...", // <-- REDACT THIS
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: [{
        role: "user",
        content: `
You are a fact-checking assistant. For the sentence below, respond in this *structured order* but **do not include any labels or numbering**:

1. First line: Verdict only → ✅ True / ❌ False / ⚠️ Needs Context  
2. Second line: Very short explanation (max 15 words)  
3. Third line: A direct, trustworthy source link (WHO, CDC, university, or government site)

Only return these three lines in your response. Do NOT include any extra text or format explanation. Ensure the source is directly relevant to the sentence's claim.

Sentence:  
"${text}"
`
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
  const resultText = data.choices?.[0]?.message?.content || "⚠️ No response from AI.";
  console.log("✅ AI Response:", resultText);

  const lines = resultText.trim().split("\n");
  const verdict = lines[0] || "⚠️ No verdict";
  const explanation = lines[1] || "⚠️ No explanation";
  const sourceUrl = lines[2] || "";

  return {
    result: `${verdict}<br>${explanation}`,
    sources: sourceUrl ? [sourceUrl] : []
  };
}

async function FactCheck(text) {
  WaitScreen();
  const result = await mockFactCheck(text);
  document.getElementById("wait-screen")?.remove();
  showResultBox(result.result, result.sources);
}

function showResultBox(Finalmessage, sources = []) {
  highlightSelection();

  const oldBox = document.getElementById("ai-result-box");
  if (oldBox) oldBox.remove();

  const box = document.createElement("div");
  box.id = "ai-result-box";

  box.innerHTML = `
    <div id="drag-header">🧠 AI Fact Checker</div>
    <p>${Finalmessage}</p>
    ${sources.length > 0
      ? `<p><strong>Sources:</strong><br>${sources.map(s => `<a href="${s}" target="_blank">${s}</a>`).join("<br>")}</p>`
      : ""}
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
  if (!selection.rangeCount || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const highlight = document.createElement("span");
  highlight.className = "ai-checker-highlight";
  highlight.appendChild(range.extractContents());
  range.insertNode(highlight);
}

function removeHighlights() {
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
