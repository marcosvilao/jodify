import React from 'react'
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateForm from './pages/CreateForm';
import { GlobalContainer } from './jodifyStyles.js'




function App() {


  return (
      <GlobalContainer>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/create-form' element={<CreateForm/>}/>
        </Routes>
      </GlobalContainer>
  )
}

export default App