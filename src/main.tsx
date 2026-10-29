import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/alfa-slab-one/latin-400.css'
import '@fontsource/special-elite/latin-400.css'
import '@fontsource/caveat/latin-500.css'
import '@fontsource/caveat/latin-700.css'
import '@fontsource/tilt-neon/latin-400.css'
import './styles/app.css'
import App from './App'
import { fitScreen } from './lib/fitScreen'

fitScreen()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
