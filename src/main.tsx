import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { StoreProvider } from './store'
import { DemoProvider } from './components/Demo'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <DemoProvider>
          <App />
        </DemoProvider>
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
