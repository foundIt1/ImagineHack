import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("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");

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "verifyText") {
    const text = message.text;

    try {
      const chatCompletion = await client.chatCompletion({
        provider: "sambanova",
        model: "deepseek-ai/DeepSeek-R1-0528",
        messages: [
          {
            role: "user",
            content: "Please analyze this sentence and tell me if it's likely misinformation:\n\n" + text
          }
        ]
      });

      const aiReply = chatCompletion.choices[0].message.content;

      chrome.tabs.sendMessage(sender.tab.id, {
        type: "resultFromAI",
        result: `🤖 AI says: "${aiReply}"`
      });

    } catch (err) {
      console.error("Hugging Face API error:", err);
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "resultFromAI",
        result: `❌ Error getting AI response`
      });
    }
  }
});