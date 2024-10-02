import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthContext.jsx'
import MessageProvider from './context/MessageContext.jsx'
import { FilterProvider } from './context/FilterContext.jsx'
import QueryProvider from './lib/react-query/QueryProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <QueryProvider>
    <AuthProvider>
      <MessageProvider>
      <FilterProvider>
        <App />
        </FilterProvider>
      </MessageProvider>

    </AuthProvider>
    </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
