import React from 'react'
import theme from '../../jodifyStyles'
import {BrandContainer, Brand} from './Title'
import logo from '../../assets/Jodify-logo.png'

function Title() {
  const time = new Date().getHours().toLocaleString();
  const timeTitle = 6 < time && time < 12 ? '¡Buenos días!' : 12 < time && time < 20 ? '¡Buenas tardes!' : '¡Buenas noches!'

  return (
    <BrandContainer>
        <a href="https://jodify-client.vercel.app/">
          <img style={{borderRadius: theme.jodify_borders._lg_border_radius}} src={logo} alt="" width={80} height={80} />
        </a>
        
        {/* <Brand color={theme.jodify_colors._text_white}>{timeTitle}</Brand> */}
    </BrandContainer>
  )
}

export default Title