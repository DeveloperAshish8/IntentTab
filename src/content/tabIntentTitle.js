/**
 * Content Script: Dynamic Tab Title Modifier
 * Fetches the user's intent for the current tab and appends it to the document's title.
 */

let currentSuffix = '';
let observer = null;

const initDynamicTitle = async () => {
  // Request intent data from background worker for this specific tab
  chrome.runtime.sendMessage({ type: 'getTabInfo' }, (response) => {
    if (response && response.intentData && response.intentData.intent) {
      const intentText = response.intentData.intent;
      currentSuffix = ` | Intent: ${intentText}`;
      
      applyTitleModifier(currentSuffix);
      observeTitleChanges();
    }
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'updateIntentTitle' && request.newIntent) {
    const newSuffix = ` | Intent: ${request.newIntent}`;
    updateGivenTargetTitle(newSuffix);
  }
});

const updateGivenTargetTitle = (newSuffix) => {
  const oldTitleBase = currentSuffix && document.title.includes(currentSuffix) 
    ? document.title.replace(currentSuffix, '') 
    : document.title;
    
  currentSuffix = newSuffix;
  
  if (observer) {
    observer.disconnect();
  }
  
  document.title = `${oldTitleBase}${currentSuffix}`;
  
  if (observer) {
    startObserving();
  }
};

/**
 * Appends the intent to the document.title if it's not already there.
 * @param {string} suffix - The string to append to the title.
 */
const applyTitleModifier = (suffix) => {
  if (document.title && !document.title.includes(suffix)) {
    document.title = `${document.title}${suffix}`;
  }
};

/**
 * Sets up a MutationObserver to watch for changes to the <title> element.
 * Useful for Single Page Applications (SPAs) where the title changes dynamically.
 */
const observeTitleChanges = () => {
  const titleElement = document.querySelector('title');
  if (!titleElement) return;

  observer = new MutationObserver((mutations) => {
    // Avoid infinite loops triggered by our own modifications
    const currentTitle = document.title;
    if (currentTitle && !currentTitle.includes(currentSuffix)) {
      // Pause observer temporarily to apply our change without triggering it again
      observer.disconnect();
      document.title = `${currentTitle}${currentSuffix}`;
      startObserving();
    }
  });

  startObserving();
};

const startObserving = () => {
  const titleElement = document.querySelector('title');
  if (titleElement && observer) {
    observer.observe(titleElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
};

// Initialize when script loads
initDynamicTitle();
