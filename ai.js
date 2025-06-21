const API_URL = "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-0528";
const API_KEY = "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"; // Replace this

async function realFactCheck(text) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `Fact check this claim:\n\n"${text}"`
      })
    });

    const data = await response.json();

    return {
      result: data?.generated_text || "✅ AI says it's likely accurate.",
      sources: [] // You can customize this if your model outputs links
    };
  } catch (error) {
    console.error("❌ API request failed:", error);
    return {
      result: "⚠️ Error contacting the AI model.",
      sources: []
    };
  }
}
