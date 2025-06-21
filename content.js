
// Mock AI checker function
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

// Step 5: Show a floating result box
function showResultBox(message) {
  // Remove any existing result box
  Finalmessage,sources=mockFactCheck(message);
  const box = document.createElement("div");
  box.id = "ai-result-box";
  Object.assign(box.style, {
    position: "fixed",
    top: "80px",
    right: "20px",
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
    <h3 style="margin-bottom: 10px; font-size: 18px; font-weight: 600; color: #2f3542;">🧠 AI Fact Checker</h3>
    <p style="margin-bottom: 10px;">${message}</p>
    ${sources.length > 0
      ? `<p><strong>Sources:</strong><br>${sources.map(s => `<a href="${s}" target="_blank">${s}</a>`).join("<br>")}</p>`
      : ""
    }
    <small style="color:#d63031; display:block; margin-top:10px;">⚠ AI-generated result. Please verify sources.</small>
    <button id="close-result-box" style="margin-top:10px; background-color:#ccc; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;">✖ Close</button>
  `;

  document.body.appendChild(box);
  // Close button event
  document.getElementById("close-result-box").addEventListener("click", () => {
    box.remove();
  });

  makeDraggable(box,document,getElementById("drag-header"));
  function makeDraggable(element, handle) {
  let offsetX = 0, offsetY = 0, isDragging = false;

  handle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    document.body.style.userSelect = "none"; // prevent accidental text selection
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
}