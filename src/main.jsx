import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css'; // primeiro: tokens e base; componentes sobrescrevem depois
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
