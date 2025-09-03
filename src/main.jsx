import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import font packages
import "@fontsource/playfair-display/400.css"; // Regular
import "@fontsource/playfair-display/700.css"; // Bold
import "@fontsource/montserrat/300.css"; // Light
import "@fontsource/montserrat/400.css"; // Regular
import "@fontsource/montserrat/500.css"; // Medium
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
