import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const USE_MSW = import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true';

async function enableMocking() {
  if (USE_MSW) {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
  }
  return Promise.resolve();
}

enableMocking().then(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
