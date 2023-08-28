import styled from 'styled-components'

export const Wrapper = styled.div`
    margin: 0 auto;
    width: 92%;
    max-width: 700px;
    display: flex;
    justify-content: left;
    /* padding-left: 27px; */
`

export const Box = styled.div`
    display: flex;
    /* width: 207px; */
    align-items: flex-start;
    gap: 10px;
    padding-top: 10px;
`

export const FilterWrapper = styled.div`
    display: flex;
    height: 10px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #C6C6C6;
    max-width: 100%


`

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  gap: 8px;
  /* margin-top: 1rem; */
  /* padding: 8px; */
  /* max-width: 200px; */

`;

export const CityWrapper = styled.div`
display: flex;
max-width: 264px;
width:260px;
/* height: 39px; */
padding: 8px;
justify-content: center;
align-items: center;
/* gap: 10px; */
flex-shrink: 0;
border-radius: 5px;
background: #EBEBEB;

`;

export const TextWrapper = styled.div`
color: #333;
font-family: Roboto Condensed;
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: 24px; /* 133.333% */

`;

export const DateWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.3s, visibility 0.3s;

    &.visible {
        display: flex;
        opacity: 1;
        visibility: visible;
    }

`;


