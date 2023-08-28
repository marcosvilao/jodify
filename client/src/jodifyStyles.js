import styled from 'styled-components'

export const GlobalContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 100%;
    max-width: 689px;
`

const theme = {
    colors : {
        _color_bg: '#f5f5f5',
        _color_bg_card: '#eaeaea',
        _color_day_date: '#3e3f41',
        _color_card_description: '#333333',
        _color_brand: '#000000',
        _color_selected_filter: '#ECD8F5'
    },
    transitions : {
        _transition: 'all 400ms ease',
    },
    sizes : {
        _container_width_sm: '75%',
        _container_width_md: '86%',
        _container_width_lg: '90%',
    },
    fonts : {
        _title_font_family: '"Round-Bold", Helvetica, sans-serif'
    }
}

export default theme


    
      
      
