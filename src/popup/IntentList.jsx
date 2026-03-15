import React, { useState, useEffect } from 'react';
import { getTabIntents, updateTabIntent, removeTabIntent } from '../utils/storage';
import IntentItem from './IntentItem';

const IntentList = () => {
  const [intents, setIntents] = useState([]);

  useEffect(() => {
    loadIntents();
    
    // Listen for storage changes to update list in real-time if needed
    const handleStorageChange = (changes, area) => {
      if (area === 'local' && changes.tabIntents) {
        setIntents(changes.tabIntents.newValue || []);
      }
    };
    
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const loadIntents = () => {
    getTabIntents((data) => {
      setIntents(data);
    });
  };

  const handleUpdate = (tabId, newIntent) => {
    updateTabIntent(tabId, newIntent);
    // State will be updated via storage listener, but we can also do it optimistically:
    setIntents(prev => prev.map(item => 
      item.tabId === tabId ? { ...item, intent: newIntent } : item
    ));
  };

  const handleDelete = (tabId) => {
    removeTabIntent(tabId, (newData) => {
      setIntents(newData);
    });
  };

  if (intents.length === 0) {
    return (
      <div className="empty-state">
        <p>No intents saved yet.</p>
        <span>Open a new tab to start tracking.</span>
      </div>
    );
  }

  return (
    <ul className="intent-list">
      {intents.map((item) => (
        <IntentItem 
          key={item.tabId} 
          item={item} 
          onUpdate={handleUpdate} 
          onDelete={handleDelete} 
        />
      ))}
    </ul>
  );
};

export default IntentList;
