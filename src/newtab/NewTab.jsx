import React, { useState, useEffect } from 'react';
import IntentInput from '../components/IntentInput';
import { saveIntentStore, saveToHistory, saveTabIntent } from '../utils/storage';

const NewTab = () => {
  const [intentSaved, setIntentSaved] = useState(false);
  const [hasIntent, setHasIntent] = useState(false);
  const [warning, setWarning] = useState(null);
  
 const handleClose = async () => {
  try {
    const tab = await chrome.tabs.getCurrent();
    chrome.tabs.update(tab.id, {
      url: "https://www.google.com"
    });
  } catch (err) {
    console.error("Failed to redirect tab:", err);
  }
};

  useEffect(() => {
    // Check if there's a warning from the background script
    chrome.storage.local.get(['warning'], (result) => {
      if (result.warning) setWarning(result.warning);
    });
  }, []);

  const handleIntentSubmit = async (intentText) => {
    try {
      // Get current tab ID
      const tab = await chrome.tabs.getCurrent();
      const tabId = tab.id;

      // Save to session (for current tab) and local history
      saveIntentStore(tabId, intentText);
      saveTabIntent(tabId, intentText); // Keep track of active intents for the popup
      saveToHistory({
        tabId,
        intent: intentText,
        createdAt: Date.now()
      });

      setHasIntent(true);
      setIntentSaved(true);
      
      // We can also try to focus the omnibox or show a success state
      // For now, let's keep it minimal and just show a neat success state
    } catch (e) {
      console.error('Failed to set intent', e);
    }
  };

  if (intentSaved) {
    if (hasIntent) {
      return (
        <div className="newtab-container intent-set">
          <div className="success-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1>Intent captured</h1>
          <p>You can now use this tab.</p>
          <div className="decorative-glow"></div>
        </div>
      );
    }
    
    // Normal browsing empty interface
    return <div className="newtab-container empty-browse"></div>;
  }

  return (
    <div className="newtab-container">
      <button 
        className="close-page-btn" 
        onClick={handleClose} 
        aria-label="Close Intent Screen"
        title="Go to default new tab"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="newtab-content">
        {warning && (
          <div className="warning-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>Too many tabs opened.</strong>
              <span> Stay focused.</span>
            </div>
          </div>
        )}
        
        <h1 className="question-title">Why did you open this tab?</h1>
        <p className="question-subtitle">Pause, reflect, and proceed with intention.</p>

        <IntentInput onSubmit={handleIntentSubmit} />
      </div>
      
      <div className="decorative-glow"></div>
    </div>
  );
};

export default NewTab;
