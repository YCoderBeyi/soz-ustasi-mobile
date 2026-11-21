import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/base.css';
import './styles/animations.css';
import './styles/media.css';
import './styles/tile.css';
import { installFeedbackDurationTokens } from './game/feedbackTiming';

// Install before App loads — static App import is hoisted and can throw during module init.
installFeedbackDurationTokens(document.documentElement);

const { default: App } = await import('./App');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
