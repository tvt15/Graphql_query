import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// const rootContainer = document.getElementById('root') as HTMLElement;

// ReactDOM.createRoot(rootContainer).render(
//   <React.StrictMode>
//     <div style={{ height: '100vh', overflow: 'auto', margin: '0'}}>
//       <App />
//     </div>
//   </React.StrictMode>,
// );
