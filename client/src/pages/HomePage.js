import React, { useEffect, useState } from 'react'
import Title from '../components/Jodify-Title/Title.jsx'
import Grid from '../components/Events-grid/Grid.jsx'
import { GlobalContainer } from '../jodifyStyles.js'
import SearchEvents from '../components/Search-field/SearchEvents.jsx'
import FilterEvents from '../components/Filters/FilterEvents.jsx'
import { StickyHeader } from './HomePageStyles.js'
import { fetchCities, fetchTypes } from '../storage/actions.js'

function HomePage() {
  const [cities, setCities] = useState([])
  const [types, setTypes] = useState([])
  useEffect(() => {
    async function fetchData() {
      setCities(await fetchCities());
      setTypes(await fetchTypes());
    }
    fetchData();
  }, []);

  return (
    <GlobalContainer>
    <Title/>
    <StickyHeader>
      <div style={{marginTop: '16px'}}>
    <SearchEvents/>
    <FilterEvents cities={cities} types={types}/>
      </div>
    </StickyHeader>
    <Grid/>
    </GlobalContainer>
  )
}

export default HomePage
