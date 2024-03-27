import React from "react";
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



serviceWorkerRegistration.register();