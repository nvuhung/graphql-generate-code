import styled from '../theme/styled-components';

export const LiActive = styled('li')<{ active?: boolean }>`
  padding: 10px;
  cursor: pointer;
  border-bottom: solid 1px;
  border-color: ${props => props.theme.borderColor};
  display: flex;
  justify-content: space-between;

  &:hover,
  &.active {
    background-color: ${props => props.theme.secondaryColor};
    color: #fff;
  }
`;