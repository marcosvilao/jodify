import styled from 'styled-components'


export const GlobalContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    background-color: #0C0C0C;
    width: 100%;
    /* position: absolute; */
    max-width: 689px;
`

const theme = {
    colors : {
        _color_bg: '#f5f5f5',
        _color_bg_card: '#C6C6C6',
        _color_day_date: '#3e3f41',
        _color_card_description: '#333333',
        _color_brand: '#000000',
        _color_selected_filter: '#ECD8F5',
        _jodify_text_black : '#3E3F41',
        _color_violet_light : '#F8D8FF',
        _color_violet_strong : '#902BBB',
        _color_text_white : '#FFFFFF',
        _color_label_violet: '#69596D',
        _color_background: '#F4ECF0',
        _color_background_button: '#EBDFE9',
        _color_text_primary: '#4C444D'
    },
    jodify_borders : {
        _md_border_radius : '8px',
        _lg_border_radius : '12px',
        _sm_border_radius : '6px'
    },
    jodify_colors : {
        _icons_primary : '#7C16F5',
        _background_gray : '#1B1C20',
        _text_white : '#E8DFE9',
        _text_gray : '#6B5A6C',
        _background_black : '#0C0C0C',
        _interval_gray : '#625E67',
        _gradient : 'linear-gradient(90deg, #EA33F7 0%, #7C16F5 100%)',
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


    
      
      
