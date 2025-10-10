import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import './global.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>         {/* <-- оборачиваем всё в AuthProvider */}
      <Router>
        <App />
      </Router>
  </React.StrictMode>,
);
