import React from 'react'
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateForm from './pages/CreateForm';




function App() {


  return (
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/create-form' element={<CreateForm/>}/>
        </Routes>
  )
}

export default App