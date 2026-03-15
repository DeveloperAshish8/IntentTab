import React, { useState, useEffect } from 'react';
import { getHistory } from '../utils/storage';
import IntentList from './IntentList';

const Popup = () => {
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    // Check for warnings
    chrome.storage.local.get(['warning'], (result) => {
      if (result.warning) setWarning(result.warning);
    });
  }, []);

  return (
    <div className="popup-container">
      <header className="popup-header">
        <div className="title-group">
          <div className="logo-icon"></div>
          <h1>IntentTab</h1>
        </div>
      </header>

      {warning && (
        <div className="popup-warning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            <strong>Too many tabs</strong>
            <span>You opened &gt;5 tabs in 1 min.</span>
          </div>
        </div>
      )}

      <main className="popup-content">
        <div className="section-header">
          <h2>Tab Intents</h2>
        </div>

        <IntentList />
      </main>
    </div>
  );
};

export default Popup;
