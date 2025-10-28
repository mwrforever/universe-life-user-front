import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// 回到原始App.tsx排查问题
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
