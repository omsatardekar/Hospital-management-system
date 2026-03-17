import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { store } from './app/store'
import { ThemeBridge } from './app/ThemeBridge'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeBridge>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeBridge>
    </Provider>
  </StrictMode>,
)
