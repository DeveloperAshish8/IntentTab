## IntentTab – Chrome Extension for Intent-Driven Browsing

### Introduction

IntentTab is a productivity-focused Chrome Extension built with React + Vite that replaces the default Chrome New Tab page with a simple prompt asking:

#### “Why did you open this tab?”
By encouraging users to define their intent before browsing, IntentTab helps reduce mindless tab opening, distraction, and tab overload.

Once an intent is entered, the extension:

- Saves the intent
- Append it to the title of current page
- Keeps a history of intents
- Shows warnings if too many tabs are opened too quickly

This creates a lightweight system to promote intentional browsing and focus.

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/DeveloperAshish8/IntentTab.git
cd IntentTab
```

2. **Install dependencies**

Make sure you have **Node.js (v16 or later)** installed.

```bash
npm install
```

---

## Running the Project

### 1. Build the Extension

Chrome extensions must be loaded from a built folder.

```bash
npm run build
```

This will generate the production files inside the `dist/` directory.

---

### 2. Load the Extension in Chrome

1. Open Chrome and navigate to:

```
chrome://extensions
```

2. Enable **Developer Mode** (toggle in the top right corner).

3. Click **Load unpacked**.

4. Select the `dist` folder from the project directory.

The **IntentTab extension** will now be installed and active.

---

### 3. Test the Extension

- Open a **new tab** — the IntentTab interface should appear.
- Enter an intent (e.g., _Search React docs_) and click **Continue**.
- Navigate to a website and verify the **floating intent widget** appears.
- Click the **extension icon** to open the popup dashboard and view recent intents.
