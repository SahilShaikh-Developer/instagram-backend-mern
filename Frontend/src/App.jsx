import React from 'react'
import AppRoutes from './AppRoutes'
import "./style.scss"
import { ToastContainer } from "react-toastify";


const App = () => {
  return (
  <>
   <AppRoutes/>
   <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />
  </>

   
  )
}

export default App
