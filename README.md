# ImagineHack

## 🔍 Project Title  
**AI Checker**: A Chrome Extension for Countering Misinformation on Websites

## 📄 Description  
**AI Checker** is a Google Chrome extension designed to combat misinformation by enabling users to fact-check claims directly on web pages. With AI integration, users can highlight any text and receive instant verification without leaving the page. The goal is to restore trust and accountability in digital spaces by making credible information accessible and easy to use.

## 👨‍💻 Team Members  
- Shawn  
- Bunta Iwasaki  
- Hokiento  
- Yen-Mei  
- Saad

## 💻 Technologies Used

### Frontend  
- **HTML** – Structure for the popup UI and result display.  
- **CSS** – Styling for user interface and layout.  
- **JavaScript** – Handling user interaction, selection logic, DOM updates.

### Backend / AI Integration  
- **JavaScript** – Handles API calls and response parsing.  
- **OpenAI API / OpenRouter** – Powers fact-checking logic via large language models.

### Platform  
- **Chrome Extension APIs** – Uses `manifest.json`, `content_scripts`, `background.js`, and `chrome.runtime` for extension logic.

### Version Control  
- **Git & GitHub** – For collaboration and source control.

## ⚔️ Challenge  
The rise of fake news and misinformation has created a dangerous environment of confusion and distrust. Manually verifying information is tedious and often skipped, leaving users vulnerable to manipulation. We aim to address this challenge with an automated and accessible solution.

## 🛠️ Our Approach

### ✅ In-Browser Fact-Checking  
Users can verify information directly within any webpage, avoiding tab-switching or copy-pasting.

### 🤖 AI-Powered Verification  
Utilizes large language models to assess the truthfulness of selected text and generate short, evidence-based results.

### 🔗 Seamless Chrome Integration  
The extension integrates smoothly with Chrome for a frictionless user experience.

### 📢 Transparent Results  
All results come with a disclaimer and — if available — a trustworthy source (e.g., `.gov`, `.edu`, `who.int`).

### 📈 Future Roadmap  
Initial version supports text verification. Planned future updates include:
- Image fact-checking  
- Multilingual support  
- Real-time misinformation alerts

## 🧪 How It Works

1. **Install the Extension**  
   Add "AI Checker" from the Chrome Web Store.

2. **Browse the Web**  
   Open any article, blog post, or social media content in Chrome.

3. **Highlight Text**  
   Select the sentence or claim you want to verify.

4. **Click "AI Checker"**  
   A button appears. Click it to analyze the selection.

5. **View the Results**  
   A popup displays the verdict, a short explanation, and (when possible) a trusted source link.

## 🧭 Notes
- Verdicts are AI-generated and may not be 100% accurate. Always consult multiple sources.
- The extension prioritizes links from WHO, CDC, .gov, and .edu domains.
- If no directly accessible source is available, a fallback source is provided.
- We avoid returning broken or geo-blocked links to ensure reliability.

---

