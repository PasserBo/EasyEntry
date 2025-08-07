import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Your existing main React component
import './index.css'   // Your existing styles

console.log("🚀 EasyEntry Side Panel: Starting React app");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 