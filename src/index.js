import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <StrictMode>
      <App />
    </StrictMode>
  </React.StrictMode>,
  document.getElementById('root'),
)
