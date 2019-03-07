import styled, { keyframes } from '../theme/styled-components';

const animation = keyframes`
   0% {
      transform: rotate(0);
      animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
    50% {
      transform: rotate(900deg);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    100% {
      transform: rotate(1800deg);
    }
`;

export const Loader = styled.div`
  display: inline-block;
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(255, 255, 255, 0.7);
  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 48%;
    top: 40%;
    border-radius: 50%;
    width: 0;
    height: 0;
    border: 50px solid #fff;
    border-color: ${props => props.theme.primaryColor} transparent
      ${props => props.theme.primaryColor} transparent;
    animation: ${animation} 1.2s infinite;
  }
`;
