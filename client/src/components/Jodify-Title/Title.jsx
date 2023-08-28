import React from 'react'
import theme from '../../jodifyStyles'
import {BrandContainer, Brand} from './Title'

function Title() {
  return (
    <BrandContainer>
        <Brand color={theme.colors._color_brand}>JODIFY</Brand>
    </BrandContainer>
  )
}

export default Title