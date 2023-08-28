import styled from 'styled-components'


export const Card = styled.div`
    margin: 0 auto;
    display: flex;
    width: 88%;
    padding: 8px;
    align-items: center;
    gap: 8px;
    border-radius: 10px;
    background: #EBEBEB;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.10);
`

export const EventImage = styled.img`
    border-radius: 5px;
    /* margin: 10px 10px 10px 10px; */
    height: 82px;
    object-fit: cover;
    position: relative;
    width: 82px;
`

export const EventDescription = styled.div`
    align-items: flex-start;
    display: inline-flex;
    flex: 0 0 auto;
    flex-direction: column;
    gap: 3px;
    position: relative;
    width: 65%;
`

export const TitleContainer = styled.div`
    max-width: 90%;
    height: 1.5rem;
    align-items: center;
    display: inline-flex;
    flex: 0 0 auto;
    gap: 8px;
    position: relative;
    overflow: hidden;
    white-space: nowrap; 
    text-overflow: ellipsis; 
`;

export const LocationContainer = styled.div`
    height: 1.5rem;
    align-items: center;
    display: inline-flex;
    flex: 0 0  auto;
    gap: 8px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; 
`

export const TitleText = styled.p`
    overflow: hidden;
    color: #333333;
    font-family: "Roboto Condensed-Medium", Helvetica;
    font-size: 13px;
    font-weight: 550;
    letter-spacing: 0;
    line-height: 24px;
    margin-top: 1px;
    position: relative;
    
`

export const Icon = styled.span`
    align-items: center;
    display: inline-flex;
    flex: 0 0 auto;
    gap: 8px;
    position: relative;
    width: 18px;
    height: 18px;
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
