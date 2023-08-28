import styled from 'styled-components'


export const Card = styled.div`
    margin: 0 auto;
    align-items: center;
    background-color: #eaeaea;
    border-radius: 5px;
    display: flex;
    gap: 10px;
    height: 90px;
    padding: 0px 0px 0px 0px;
    position: relative;
    width: 90%; 
    max-width: 689px;
`

export const EventImage = styled.img`
    border-radius: 5px;
    margin-left: 0.3rem;
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
    gap: 0px;
    position: relative;
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
    color: #333333;
    font-family: "Roboto Condensed-Medium", Helvetica;
    font-size: 13px;
    font-weight: 550;
    letter-spacing: 0;
    line-height: 24px;
    margin-top: 1px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
`

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
    color: #333333;
    font-family: "Roboto Condensed-Medium", Helvetica;
    font-size: 13px;
    font-weight: 550;
    letter-spacing: 0;
    line-height: 24px;
    margin-top: 1px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
`