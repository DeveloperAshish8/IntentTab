export const saveIntentStore = (tabId, intent) => {
  const intentData = {
    tabId,
    intent,
    createdAt: Date.now()
  };
  chrome.storage.session.set({ [`intent_${tabId}`]: intentData });
};

export const getIntentStore = (tabId, callback) => {
  chrome.storage.session.get([`intent_${tabId}`], (result) => {
    callback(result[`intent_${tabId}`]);
  });
};

export const saveToHistory = (intentData) => {
  chrome.storage.local.get(['intentHistory'], (result) => {
    let history = result.intentHistory || [];
    history.unshift(intentData);
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    chrome.storage.local.set({ intentHistory: history });
  });
};

export const getHistory = (callback) => {
  chrome.storage.local.get(['intentHistory'], (result) => {
    callback(result.intentHistory || []);
  });
};

// Tab Intents Utilities
export const getTabIntents = (callback) => {
  chrome.storage.local.get(['tabIntents'], (result) => {
    callback(result.tabIntents || []);
  });
};

export const saveTabIntent = (tabId, intent) => {
  chrome.storage.local.get(['tabIntents'], (result) => {
    let intents = result.tabIntents || [];
    // Check if it already exists and remove it to update
    intents = intents.filter(item => item.tabId !== tabId);
    
    intents.unshift({
      tabId,
      intent,
      createdAt: Date.now()
    });
    
    chrome.storage.local.set({ tabIntents: intents });
  });
};

export const updateTabIntent = (tabId, newIntent) => {
  chrome.storage.local.get(['tabIntents'], (result) => {
    let intents = result.tabIntents || [];
    const index = intents.findIndex(item => item.tabId === tabId);
    
    if (index !== -1) {
      intents[index].intent = newIntent;
      // Preserve original createdAt or update it? We'll preserve it.
      chrome.storage.local.set({ tabIntents: intents });
    }
  });

  chrome.storage.session.get([`intent_${tabId}`], (result) => {
    let intentData = result[`intent_${tabId}`];
    if (intentData) {
      intentData.intent = newIntent;
      chrome.storage.session.set({ [`intent_${tabId}`]: intentData });
    }
  });

  chrome.tabs.sendMessage(tabId, { type: 'updateIntentTitle', newIntent: newIntent }).catch(() => {});
};

export const removeTabIntent = (tabId, callback) => {
  chrome.storage.local.get(['tabIntents'], (result) => {
    let intents = result.tabIntents || [];
    const filtered = intents.filter(item => item.tabId !== tabId);
    
    chrome.storage.local.set({ tabIntents: filtered }, () => {
      if (callback) callback(filtered);
    });
  });
};
