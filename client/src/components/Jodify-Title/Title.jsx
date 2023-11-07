import React from 'react'
import theme from '../../jodifyStyles'
import {BrandContainer, Brand} from './Title'

function Title() {
  const time = new Date().getHours().toLocaleString();
  const timeTitle = 6 < time && time < 12 ? '¡Buenos días!' : 12 < time && time < 20 ? '¡Buenas tardes!' : '¡Buenas noches!'

  return (
    <BrandContainer>
        <Brand color={theme.jodify_colors._text_white}>{timeTitle}</Brand>
    </BrandContainer>
  )
}

export default Title