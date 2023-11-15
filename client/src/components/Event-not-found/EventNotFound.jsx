import React from 'react'
import theme from '../../jodifyStyles';

function EventNotFound() {
  return (
    <div
    style={{
        display: 'flex',
        width: '100%',
        marginTop: '50%',
        height: '14px',
        justifyContent: 'center',
        }}
    >
        <p
        style={{
            color: theme.jodify_colors._text_white,
            fontFamily: theme.fonts._title_font_family,
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: 'normal',
        }}
        >No se encontraron eventos.</p>
    </div>
  )
}

export default EventNotFound