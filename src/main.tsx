
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRoutes } from './routes/routes'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <>
    <AppRoutes />
    <ToastContainer />
  </>
)
