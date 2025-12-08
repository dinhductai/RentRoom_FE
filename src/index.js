import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './assets/vendor/animate.css/animate.min.css';
import './assets/vendor/bootstrap/css/bootstrap.min.css';
import './assets/vendor/bootstrap-icons/bootstrap-icons.css';
import './assets/vendor/swiper/swiper-bundle.min.css';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';

// Disable React error overlay for Bootstrap modal errors
if (process.env.NODE_ENV === 'development') {
  const originalErrorHandler = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (typeof message === 'string' && 
        (message.includes('backdrop') || 
         message.includes('Ti._initializeBackDrop') ||
         message.includes('Ti.getOrCreateInstance'))) {
      return true; // Suppress the error
    }
    if (originalErrorHandler) {
      return originalErrorHandler(message, source, lineno, colno, error);
    }
    return false;
  };
}

ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);
registerServiceWorker();