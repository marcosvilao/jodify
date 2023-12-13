import React from 'react'
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateForm from './pages/CreateForm';
import CreatePromoter from './pages/CreatePromoter';




function App() {


  return (
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/create-form' element={<CreateForm/>}/>
          <Route path='/create-promoter' element={<CreatePromoter/>}/>
        </Routes>
  )
}

export default App