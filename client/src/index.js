import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store/index";
import Modal from "react-modal";
import { LicenseInfo } from "@mui/x-license-pro";
import { Analytics } from "@vercel/analytics/react";
import { Auth0Provider } from "@auth0/auth0-react";
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';

const mui = process.env.REACT_APP_MUI;

LicenseInfo.setLicenseKey(mui);

Modal.setAppElement("#root");
const root = ReactDOM.createRoot(document.getElementById("root"));
const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth0ClientID = process.env.REACT_APP_AUTH0_CLIENTID;

const InstallButton = () => {
  const [installable, setInstallable] = useState(false);
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPromptRef.current = e;
      // Show the install button
      setInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    // Show the prompt
    deferredPromptRef.current.prompt();
    // Wait for the user to respond to the prompt
    deferredPromptRef.current.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPromptRef.current = null;
      setInstallable(false);
    });
  };

  if (!installable) {
    return null;
  }

  return (
    <button onClick={handleInstallClick} style={{ position: "fixed", bottom: "20px", right: "20px" }}>
      Install App
    </button>
  );
};

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <Auth0Provider
        domain={auth0Domain}
        clientId={auth0ClientID}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <BrowserRouter>
          <InstallButton />
          <App />
          <Analytics />
        </BrowserRouter>
      </Auth0Provider>
    </React.StrictMode>
  </Provider>
);



serviceWorkerRegistration.register();