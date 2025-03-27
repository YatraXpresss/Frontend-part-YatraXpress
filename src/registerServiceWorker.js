export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Only register service worker in production
      if (import.meta.env.PROD) {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful:', registration.scope);
          })
          .catch(error => {
            console.error('ServiceWorker registration failed:', error);
          });
      } else {
        // Unregister any existing service worker in development
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (let registration of registrations) {
            registration.unregister();
          }
        });
      }
    });
  }
}