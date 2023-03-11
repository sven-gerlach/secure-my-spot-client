import dotenv from "dotenv";
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import './index.scss';
import App from './views/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";


// initialise Log Rocket -> enclosing the initialisation inside a function is necessary to avoid the test suite
// initialising a XMLHTTPRequest every time the configLogRocket module is loaded
initialiseLogRocket()

// initialise dotenv
dotenv.config()

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
