import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./storage/store"; // Import your Redux store
import Modal from "react-modal";
import { LicenseInfo } from "@mui/x-license-pro";
import { Analytics } from "@vercel/analytics/react";
import { Auth0Provider } from "@auth0/auth0-react";

LicenseInfo.setLicenseKey(
  "0bead84d3f16ad30d71410a8ae62882aTz03NzkzMixFPTE3MzA1NzY3MTEwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI="
);

Modal.setAppElement("#root");
const root = ReactDOM.createRoot(document.getElementById("root"));
const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth0ClientID = process.env.REACT_APP_AUTH0_CLIENTID;

console.log(auth0Domain)
console.log(auth0ClientID)

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
          <App />
          <Analytics />
        </BrowserRouter>
      </Auth0Provider>
    </React.StrictMode>
  </Provider>
);
