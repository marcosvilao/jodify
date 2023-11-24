import React from 'react'
import Title from '../components/Jodify-Title/Title.jsx'
import Grid from '../components/Events-grid/Grid.jsx'
import { GlobalContainer } from '../jodifyStyles.js'
import SearchEvents from '../components/Search-field/SearchEvents.jsx'
import FilterEvents from '../components/Filters/FilterEvents.jsx'
import { StickyHeader } from './HomePageStyles.js'

function HomePage() {
  return (
    <GlobalContainer>
    <Title/>
    <StickyHeader>
      <div style={{marginTop: '16px'}}>
    {/* <SearchEvents/> */}
    <FilterEvents/>
      </div>
    </StickyHeader>
    <Grid/>
    </GlobalContainer>
  )
}

export default HomePage