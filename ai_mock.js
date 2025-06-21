export function factCheck(text) {
  const lower = text.toLowerCase();
  
  if (lower.includes("5g causes cancer")) {
    return {
      result: "❌ Misinformation Detected: There's no scientific evidence that 5G causes cancer.",
      sources: [
        "https://www.who.int/news-room/q-a-detail/radiation-5g-mobile-networks-and-health"
      ]
    };
  } else if (lower.includes("vaccines contain microchips")) {
    return {
      result: "❌ Misinformation Detected: Vaccines do not contain microchips. This is a debunked conspiracy theory.",
      sources: [
        "https://www.cdc.gov/vaccinesafety/concerns/microchips.html"
      ]
    };
  }

  return {
    result: "✅ No obvious misinformation detected in selected text."
  };
}