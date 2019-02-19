import styled from '../theme/styled-components';

export const ButtonPrimary = styled.input`
  cursor: pointer;
  padding: 10px 20px;
  background-color: ${props => props.theme.primaryColor};
  color: #fff;
  text-align: center;
  line-height: 14px;
  border-radius: 40px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  margin-left: 10px;

  &:hover {
    background-color: ${props => props.theme.secondaryColor};
  }

  &:focus {
    outline: none;
  }
`;

export const ButtonRemove = styled.input`
  outline: none;
  box-shadow: none;
  border-radius: 50%;
  cursor: pointer;
  border: solid 1px red;
  color: red;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
