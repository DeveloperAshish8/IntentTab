import React from 'react';
import ReactDOM from 'react-dom/client';
import FloatingIntent from '../components/FloatingIntent';
import './intentOverlay.css'; // Will be converted and injected

// Create a container for our React app
const containerId = 'intent-tab-widget-root';
if (!document.getElementById(containerId)) {
  const container = document.createElement('div');
  container.id = containerId;
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);
  root.render(<FloatingIntent />);
}
