import React from 'react'
import AppRoutes from './app.routes.jsx'
import "./features/shared/global.scss"
import { AuthProvider } from './features/auth/auth.context.jsx';


const App = () => {
  return (
  <>
  <AuthProvider>
   <AppRoutes/>
   </AuthProvider>
 
  </>

   
  )
}

export default App
