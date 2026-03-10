import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import './App.css'
import App from './App.jsx'
import QueryProvider from './tanstack/QueryProvider.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#e63946', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ff4d4d', secondary: '#fff' } },
        }}
      />
    </QueryProvider>
  </StrictMode>,
)
