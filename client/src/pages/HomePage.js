import React from 'react'
import Title from '../components/Jodify-Title/Title.jsx'
import Searchfield from '../components/Search-field/Searchfield.jsx'
import Grid from '../components/Events-grid/Grid.jsx'
import { GlobalContainer } from '../jodifyStyles.js'
import Filters from '../components/Filters/Filters.jsx'

function HomePage() {
  return (
    <GlobalContainer>
    <Title/>
    <Searchfield/>
    <Filters/>
    <Grid/>
    </GlobalContainer>
  )
}

export default HomePage