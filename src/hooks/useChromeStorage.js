import { useState, useEffect } from 'react';

export function useChromeStorage(key, area = 'local', initialValue = null) {
  const [value, setValue] = useState(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    chrome.storage[area].get([key], (result) => {
      if (result[key] !== undefined) {
        setValue(result[key]);
      }
      setIsLoaded(true);
    });

    const listener = (changes, namespace) => {
      if (namespace === area && changes[key]) {
        setValue(changes[key].newValue);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, [key, area]);

  const setStoreValue = (newValue) => {
    setValue(newValue);
    chrome.storage[area].set({ [key]: newValue });
  };

  return [value, setStoreValue, isLoaded];
}
