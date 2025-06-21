# ImagineHack

------Project Title and Description-----
<Title>
AI Checker: A Chrome Extension for Countering Misinformation on Websites

<Description>
"AI Checker" is a Google Chrome extension developed to combat misinformation and misleading content on websites. Harnessing the power of AI, it eliminates the need for users to switch tabs and manually search for information, instantly verifying the accuracy of text within articles. In today's hyperconnected information society, its objective is to rebuild trust and accountability in online spaces. Users can simply select suspicious text and click the "AI Checker" button to receive AI-powered fact-checking results and, when necessary, the evidence supporting those findings.

------Team Members------
Shawn
Bunta Iwasaki
Hokiento
Yen-Mei
Saaad

------Technologies Used------
<Frontend>
HTML: Structure for pop-up UI and results display.
CSS: Styling for buttons and results display, UI/UX design.
JavaScript: Detection of user interactions (text selection, button clicks), DOM manipulation (button insertion, dynamic results display).

<Backend/API Integration>
JavaScript: API request processing within the Chrome extension's background.js.
OpenAI API: Execution of AI processes such as text fact-checking, information summarization, and provision of evidence. We will start with a free API and consider expanding to large-scale AI processing in the future.

<Platform>
Google Chrome Extensions API: The foundational API for the extension. It leverages manifest.json for configuration, content_scripts, background service workers, and messaging (chrome.runtime.sendMessage, etc.).

<Version Control>
Git / GitHub: Collaborative development and code management for the team.


------Challenge and Approach------
<Challenge>
In today's hyperconnected world, misinformation and fake news, including misleading headlines and manipulated images, spread faster than ever before. This leads to public confusion, social unrest, and a decline in trust towards media, institutions, and even one another, resulting in real-world consequences. As digital citizens, we all play a role in upholding the truth. However, the scale and speed of today's information environment demand technological solutions that can proactively detect, counter, and educate against misinformation while preserving freedom of speech and access to information.

<Approach>
This project addresses this challenge with a user-centric and technology-driven approach.

<Direct and Proactive Fact-Checking>
Users can fact-check information directly on the webpage they are viewing, without leaving their browser.
This eliminates the need to open new tabs or type search queries, encouraging more frequent and effortless checks of information accuracy.

<Leveraging AI>
We utilize the analytical capabilities of large language models to determine the veracity of selected text and provide relevant facts.
This allows users to easily search regardless of the website's language or format.

<Seamless Integration>
By developing it as a Chrome extension, the tool naturally integrates into the web Browse experience, allowing users to fact-check effortlessly.

<Transparency and Trust>
We clearly state that AI's judgment is not perfect and provide reference links or sources as evidence for its findings. This enhances the tool's reliability and promotes users' digital literacy.

<Phased Development>
In the initial phase, we will focus on text fact-checking. More complex features like image fact-checking are planned for future functional enhancements.

------Usage Instructions------
1, Extension Installation:
    Users install the "AI Checker" extension from the Chrome Web Store.
2, Web Page Browse:
    Users browse any news article, blog, or social media post in their Chrome browser.
3, Text Selection:
    Users select a portion of text in the article that they find questionable.
4, Click "AI Checker" Button:
    They click the "AI Checker" button displayed in the webpage's toolbar.
5, Display Results:
    The extension sends the selected text to the AI in the background, and within seconds, the fact-checking results (e.g., "This claim may be misleading. The actual facts are...") appear as a popup on the page. The results will also include a disclaimer such as "This is an AI judgment; always verify with multiple sources," and, if possible, links to the sources the AI referenced.


