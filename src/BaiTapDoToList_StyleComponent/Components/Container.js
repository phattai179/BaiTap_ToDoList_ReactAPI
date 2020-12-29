import styled from 'styled-components'

export const Container = styled.div`
    background-color: ${props => props.theme.bgColor};
    color: ${props => props.theme.color};
    border: 5px solid ${props => props.theme.color};
    padding: 15px;
    margin-right: auto;
    margin-left: auto;
    width: 50%;
`

// witdh: 100 %;
// padding - left: 15px;
// padding - right: 15px;
// margin - left: auto;
// margin - right: auto;
// border: 3px solid ${ props => props.theme.borderColor }