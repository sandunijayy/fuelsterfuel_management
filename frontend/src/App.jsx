import { useState } from 'react'
import {Routes,Route} from "react-router"
import InventoryPage from './pages/InventoryPage'


function App() {
  

  return (
    <>
    <Routes>
      <Route path={"/"} element={<InventoryPage/>}/>
    </Routes>
    </>
  )
}

export default App
