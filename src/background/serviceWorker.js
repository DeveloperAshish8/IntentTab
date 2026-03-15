chrome.runtime.onInstalled.addListener(() => {
  console.log('IntentTab extension installed.');
  // Initialize storage
  chrome.storage.local.get(['intentHistory', 'openTabsCount'], (result) => {
    if (!result.intentHistory) chrome.storage.local.set({ intentHistory: [] });
    if (!result.openTabsCount) chrome.storage.local.set({ openTabsCount: 0 });
  });
});

chrome.tabs.onCreated.addListener((tab) => {
  console.log('New tab created', tab.id);
  // Track tab opening for "Too Many Tabs" warning
  chrome.storage.local.get(['openTabsCount', 'lastTabOpenedAt'], (result) => {
    const now = Date.now();
    const oneMinute = 60 * 1000;
    
    let count = result.openTabsCount || 0;
    let lastTime = result.lastTabOpenedAt || now;

    if (now - lastTime < oneMinute) {
      count++;
    } else {
      count = 1; // Reset window
    }

    chrome.storage.local.set({
      openTabsCount: count,
      lastTabOpenedAt: now
    });

    if (count > 5) {
      // Send warning to popup or newtab
      chrome.storage.local.set({ warning: 'Too many tabs opened. Stay focused.' });
    } else {
      chrome.storage.local.remove('warning');
    }
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  // Cleanup tab intent
  chrome.storage.session.get([`intent_${tabId}`], (result) => {
    if (result[`intent_${tabId}`]) {
      chrome.storage.session.remove(`intent_${tabId}`);
    }
  });
});

// Provide tab ID and current intent to content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getTabInfo' && sender.tab) {
    const tabId = sender.tab.id;
    chrome.storage.session.get([`intent_${tabId}`], (result) => {
      sendResponse({ tabId, intentData: result[`intent_${tabId}`] });
    });
    return true; // Keep message channel open for async response
  }
});
