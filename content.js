  //fix the highlight issue
  //make the interface more presentable
  //find a name for the extension
  //make the text more displayable
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "CHECK_TEXT") {
      FactCheck(message.payload);
    }
  });
async function validateLink(url) {
  try {
    const response = await fetch(url, { method: "HEAD", mode: "no-cors" });
    // Most servers won't allow full CORS HEAD check, but if it's `.gov`, `.edu`, `.org`, it usually works
    return response.ok || response.status === 200;
  } catch (e) {
    return false;
  }
}
function getRootDomain(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch (e) {
    console.warn("Invalid URL for root extraction:", url);
    return url; // Fallback to original if parsing fails
  }
}
  // AI Checker Logic
  async function mockFactCheck(text) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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", // <-- REDACT THIS
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [{
          role: "user",
          content: `
You are the world's best fact-checking assistant. For the sentence below, respond in this structured order and do not include any labels or numbering:

First line: Verdict only → ✅ True / ❌ False / ⚠️ Needs Context
Second line: Very short explanation (max 25 words)
Third line: A direct, trustworthy source link (WHO, CDC, university, or government site)
Sourcing Rules:

✅ Only use real, working, and globally accessible root domains from these authoritative sources:

https://www.who.int

https://www.cdc.gov

Official government websites (.gov)

Accredited educational institutions (.edu)

Recognized international organizations (.org — only if no .gov or .edu is applicable)

❌ Never use:

Deep links, subpages, PDFs, file downloads (.pdf, .doc, etc.)

Region-locked domains (e.g. .cn, .ru)

Broken/inactive URLs (404/403), redirects, or archive links

News or media sites unless from .gov or .edu

Links that require login or payment

🔍 Requirements:

Always return the main landing page/root domain of the source (e.g. https://www.cdc.gov, not subdirectories)

The source must be relevant to the sentence's claim

If no precise match is found or the sentence lacks context:

Verdict: ⚠️ Needs Context

Explanation: The claim is too vague to fact-check

Link: Root homepage of the most relevant credible authority (e.g. WHO)

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
        ? `<p><strong>Read More here:</strong><br>${sources.map(s => `<a href="${s}" target="_blank">${s}</a>`).join("<br>")}</p>`
        : ""}
      <button id="close-result-box" style="margin-top:10px; background-color:#ccc; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;">✖ Close</button>
    `;

    document.body.appendChild(box);

  setTimeout(() => {
    const closeBtn = document.getElementById("close-result-box");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        removeHighlights();
        box.remove();
      });
    }
  }, 0);

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
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const highlight = document.createElement("span");
  highlight.className = "ai-checker-highlight";

  try {
    const extractedContents = range.extractContents();
    highlight.appendChild(extractedContents);
    range.insertNode(highlight);
    selection.removeAllRanges(); // Clear selection after highlight
  } catch (err) {
    console.warn("⚠️ Highlight failed:", err);
  }
}

function removeHighlights() {
  const highlights = document.querySelectorAll("span.ai-checker-highlight");

  highlights.forEach((span) => {
    const parent = span.parentNode;
    if (!parent) return;

    const fragment = document.createDocumentFragment();
    while (span.firstChild) {
      fragment.appendChild(span.firstChild);
    }

    parent.replaceChild(fragment, span);
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
