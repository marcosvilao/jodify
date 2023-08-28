import React from 'react'
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { GlobalContainer } from './jodifyStyles.js'


function App() {
  return (
      <GlobalContainer>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
        </Routes>
      </GlobalContainer>
  )
}

export default App