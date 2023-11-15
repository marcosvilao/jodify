import styled, { css } from 'styled-components'
import theme from '../../jodifyStyles'
import ListItemText from '@mui/material/ListItemText';

export const Wrapper = styled.div`
    margin: 0 auto;
    width: 92%;
    /* max-width: 390px; */
    display: flex;
    justify-content: flex-start;
    /* padding-left: 27px; */
    /* width: fit-content; */
`

export const Box = styled.div`
    display: flex;
    /* width: 207px; */
    align-items: flex-start;
    gap: 10px;
    padding-top: 10px;
`

export const FilterWrapper = styled.div`
    display: flex; /* Use inline-flex to make it size based on content */
    background: ${theme.jodify_colors._background_gray};
    background-clip: padding-box;
    border-radius: ${theme.jodify_borders._md_border_radius};
    cursor: pointer;
    position: relative;
    height: 33px;
    align-items: center;
    justify-content: center;



    ${props => props.$hastypes && css`
    &:before {
        content: '';
        position: absolute;
        top: -1px;
        right: -1px;
        bottom: -1px;
        left: -1px;
        /* width: 80px; */
        background: ${theme.jodify_colors._gradient}; /* Adjust the gradient colors */
        border-radius: ${theme.jodify_borders._md_border_radius};;
        z-index: -1;
        border: 1px transparent;
        /* height: 40px; */
    }
    `}
`

export const FilterText = styled.p`
    width: fit-content;
    margin: 0px 10px 4px 10px;
    color: ${theme.jodify_colors._text_white}

    ${props => props.$hastypes && css`
    width: fit-content;
    margin: 0px 10px 4px 10px;
    color: ${theme.jodify_colors._text_white}
    `}
`

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  gap: 8px;

  /* margin-top: 1rem; */
  /* padding: 8px; */
  /* max-width: 600px; */

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

export const OkBtn = styled.span`
    cursor: pointer;
    &:hover{
        color: ${theme.jodify_colors._icons_primary};
    }
`

export const ItemTextList = styled(ListItemText)`
font-family: 'Roboto Condensed', sans-serif
`





