import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './storage/store'; // Import your Redux store
import Modal from 'react-modal';
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey('0bead84d3f16ad30d71410a8ae62882aTz03NzkzMixFPTE3MzA1NzY3MTEwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');

Modal.setAppElement('#root')
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </React.StrictMode>
  </Provider>
);



