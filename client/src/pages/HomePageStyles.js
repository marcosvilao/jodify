import styled from 'styled-components'
import theme from '../jodifyStyles'

export const StickyHeader2 = styled.div`
position: sticky;
top: 129px;
height: 40px;
background-color: ${theme.jodify_colors._background_black};
z-index: 50;
`

export const StickyHeader = styled.div`
position: sticky;
top: 0px;
background-color: ${theme.jodify_colors._background_black};
z-index: 100;
`
  