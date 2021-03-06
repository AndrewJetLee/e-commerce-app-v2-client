import { css } from "styled-components";

export const mobile = (props) => {
    return css`
        @media (max-width: 600px) {
            ${props}
        }
    `
}

export const tablet = (props) => {
    return css`
        @media (max-width: 768px) {
            ${props}
        }
    `
}

export const primaryColor = css`
 ${props => props.theme.colors.primary};
`

export const hoverScaleTransition = css`
 transition: transform 0.167s ease-in-out;
 :hover {
     transform: scale(1.1);
 }
`