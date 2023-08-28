import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './storage/store'; // Import your Redux store
import {SkeletonTheme} from 'react-loading-skeleton'
import Modal from 'react-modal';

Modal.setAppElement('#root')
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <SkeletonTheme baseColor='grey' highlightColor='black'>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SkeletonTheme>
    </React.StrictMode>
  </Provider>
);


