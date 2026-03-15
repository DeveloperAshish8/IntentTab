import React, { useState, useEffect, useRef } from 'react';
import { getHistory } from '../utils/storage';

const IntentInput = ({ onSubmit }) => {
  const [inputVal, setInputVal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    // Load history for auto-suggestions
    getHistory((data) => {
      // Extract unique intents
      const uniqueIntents = [...new Set(data.map((item) => item.intent))];
      setHistory(uniqueIntents);
    });
    
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputVal(val);

    if (val.trim()) {
      const filtered = history.filter((item) =>
        item.toLowerCase().includes(val.toLowerCase()) && item !== val
      ).slice(0, 3); // Max 3 suggestions
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSubmit(inputVal.trim());
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && onSkip) {
      e.preventDefault();
      onSkip();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputVal(suggestion);
    onSubmit(suggestion);
    setShowSuggestions(false);
  };

  return (
    <>
      <form className="intent-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={handleChange}
            placeholder="e.g., Search React docs"
            className="intent-input"
            onFocus={() => {
               if (inputVal.trim() && suggestions.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {showSuggestions && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="continue-btn" disabled={!inputVal.trim()}>
          Continue
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </form>
    </>
  );
};

export default IntentInput;
