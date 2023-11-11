import styled from 'styled-components'
import theme from '../../jodifyStyles'



export const Card = styled.div`
    color: ${theme.jodify_colors._icons_primary};
    height: 88px;
    margin: 0 16px auto 16px;
    display: flex;
    padding-left: 8px;
    padding-top: 6px;
    padding-bottom: 6px;
    align-items: center;
    gap: 8px;
    border-radius: ${theme.jodify_borders._lg_border_radius};
    background: ${theme.jodify_colors._background_gray};
`

export const EventImage = styled.img`
    border-radius: ${theme.jodify_borders._sm_border_radius};
    height: 82px;
    object-fit: cover;
    position: relative;
    width: 82px;
`

export const EventDescription = styled.div`
    margin-top: ${props => props.$twoLines ? '10px' : ''};
    align-items: flex-start;
    display: inline-flex;
    justify-content: center;
    flex: 0 0 auto;
    flex-direction: column;
    gap: ${props => props.$twoLines ? '9px' : '3px'};
    position: relative;
    width: 244px;
    margin-top: 10px;

`

export const TitleContainer = styled.div`
    height: 1.5rem;
    align-items: center;
    display: inline-flex;
    flex: 0 0  auto;
    gap: 8px;
    position: relative;
`

export const TitleText = styled.p`
    color: ${theme.jodify_colors._text_white};
    margin-left: 4px;
    overflow: hidden;
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 16px;
    font-weight: 550;
    letter-spacing: 0;
    line-height: 24px;
    margin-top: 11px;
    position: relative;
    white-space: normal; 
    word-wrap: break-word; 
    max-width: 100%; 
    line-height: 1.2;
`;

export const Icon = styled.span`
    align-items: center;
    display: inline-flex;
    flex: 0 0 auto;
    gap: 8px;
    position: relative;
`

export const EventLocation = styled.div`
    color: #333333;
    font-family: "Sukhumvit Set-Text", Helvetica;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 20px;
    margin-top: -1px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
`

export const TypeContainer = styled.div`

    align-items: center;
    display: inline-flex;
    flex: 0 0 auto;
    gap: 8px;
    justify-content: center;
    position: relative;
`
export const Error = styled.h3`
gap: 10px;
    display: flex;
    align-items: center;
    margin-left: 16px;
    color: ${theme.jodify_colors._text_white};
    font-family: "Roboto Condensed-Medium", Helvetica;
    font-size: 16px;
    font-weight: 550;
    letter-spacing: 0;
    line-height: 24px;
    margin-top: 1px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
`