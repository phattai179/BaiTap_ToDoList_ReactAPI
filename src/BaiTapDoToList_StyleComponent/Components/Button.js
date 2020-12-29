import styled from 'styled-components'

export const Button = styled.button`
    background-color: ${props => props.theme.bgColor};
    color: ${props => props.theme.color};
    border: ${props => props.theme.borderButton};
    padding: 0.25em 0.5em;
    font-size: 17px;
    transition: all 0.5s;
    &:hover{
        color: ${props => props.theme.hoverTextColor};
        background-color: ${props => props.theme.hoverBgColor};
        border: 1px solid ${props => props.theme.borderColor}
    };
    &:disabled{
        cursor: no-drop
    }

`