import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from "react-router/dom";
import { router } from './Routes/Router.jsx';
import AuthProvider from './Providers/AuthProvider.jsx';
import { Toaster } from 'react-hot-toast';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
       <RouterProvider router={router} />
       <Toaster position="top-center" reverseOrder={false} />
    </AuthProvider>
  </StrictMode>,
)
