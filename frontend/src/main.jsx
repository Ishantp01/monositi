import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fontsource/inter"; 
import "@fontsource/inter/300.css"; // Light
import "@fontsource/inter/400.css"; // Regular (default)
import "@fontsource/inter/500.css"; // Medium
import "@fontsource/inter/600.css"; // Semi-bold
import "@fontsource/inter/700.css"; // Bold
import "@fontsource/inter/800.css"; // Extra-bold


import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
