import React, { useState, useEffect } from 'react';

const FloatingIntent = () => {
  const [intent, setIntent] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Request intent data for this specific tab
    chrome.runtime.sendMessage({ type: 'getTabInfo' }, (response) => {
      if (response && response.intentData) {
        setIntent(response.intentData.intent);
      }
    });
  }, []);

  if (!intent || !visible) return null;

  return (
    <div className="intent-tab-overlay">
      <div className="intent-content">
        <span className="intent-label">Intent:</span>
        <span className="intent-text" title={intent}>
          {intent}
        </span>
        <button 
          className="intent-close-btn" 
          onClick={() => setVisible(false)}
          title="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default FloatingIntent;
