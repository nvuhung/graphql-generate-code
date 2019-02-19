import styled from '../theme/styled-components';

export const Input = styled.input`
  border: 1px solid;
  border-color: ${props => props.theme.primaryColor};
  border-radius: 40px;
  height: 24px;
  padding: 4px 15px;
  width: 100%;
  font-size: 14px;

  &:focus {
    outline: none;
  }
`;
