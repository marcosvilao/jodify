// src/serviceWorkerRegistration.js

// Function to register the service worker
export const register = () => {
    // Check if Service Workers are supported
    if ('serviceWorker' in navigator) {
        // Use the window load event to keep the page load performant
        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/ServiceWorker.js`;
            navigator.serviceWorker
                .register(swUrl)
                .then((registration) => {
                    console.log('Service Worker registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('Service Worker registration failed: ', registrationError);
                });
        });
    }
};

// Function to unregister the service worker
export const unregister = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
                console.log('Service Worker unregistered');
            });
        });
    }
};
