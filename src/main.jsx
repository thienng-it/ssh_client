// Global Error Handler for debugging production issues
window.onerror = function (message, source, lineno, colno, error) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;background:#1e1e2e;color:#f38ba8;padding:20px;font-family:monospace;white-space:pre-wrap;overflow:auto;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;';
  errorDiv.innerHTML = `<h1>Application Error</h1><p>${message}</p><p>${source}:${lineno}</p>`;
  document.body.appendChild(errorDiv);
};

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
