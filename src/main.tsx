import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initSentry } from './lib/sentry'
import { initAnalytics } from './lib/analytics'
import { initOneSignal } from './lib/onesignal'

// Init third-party services before render
initSentry()
initAnalytics()
initOneSignal()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
