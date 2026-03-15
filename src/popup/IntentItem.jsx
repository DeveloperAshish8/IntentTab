import React, { useState, useRef, useEffect } from 'react';

const IntentItem = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.intent);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== item.intent) {
      onUpdate(item.tabId, editValue.trim());
    } else {
      setEditValue(item.intent); // Reset if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(item.intent);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Delete this intent?')) {
      onDelete(item.tabId);
    }
  };

  return (
    <li className="intent-list-item">
      <div className="intent-list-content">
        <div className="intent-tab-info">Tab ID: {item.tabId}</div>
        
        {isEditing ? (
          <div className="intent-edit-mode">
            <input
              ref={inputRef}
              type="text"
              className="intent-edit-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
            />
          </div>
        ) : (
          <div className="intent-text-display">
            Intent: <span className="intent-value">{item.intent}</span>
          </div>
        )}
      </div>
      
      <div className="intent-actions">
        {isEditing ? (
          <button className="action-btn save-btn" onMouseDown={(e) => { e.preventDefault(); handleSave(); }}>Save</button>
        ) : (
          <>
            <button className="action-btn edit-btn" onClick={() => setIsEditing(true)}>Modify</button>
            <button className="action-btn delete-btn" onClick={handleDelete}>Delete</button>
          </>
        )}
      </div>
    </li>
  );
};

export default IntentItem;
