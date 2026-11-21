import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/base.css';
import './styles/animations.css';
import './styles/media.css';
import './styles/tile.css';
import { installFeedbackDurationTokens } from './game/feedbackTiming';
import App from './App';

installFeedbackDurationTokens(document.documentElement);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
