/**
 * Application Entry Point
 * Initializes and renders the React app to the DOM
 * Enables React StrictMode for development checks
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Create React root and render app with StrictMode enabled
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
