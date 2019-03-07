import styled from '../theme/styled-components';

export const Wrapper = styled.div`
  height: calc(100vh - 85px);
  border: solid 1px #ccc;
  margin: 20px;
  margin-top: 0;
  border-radius: 10px;
`;

export const Column = styled.div`
  width: 100%;
`;

export const SchemaContainer = styled('div')<{ hasBorder?: boolean }>`
  display: flex;
  flex-flow: column;
  height: 50%;
  border-top: solid ${props => props.theme.borderColor};
  border-width: ${props => (props.hasBorder ? '1px' : 0)};
`;

export const SchemaHeader = styled.div`
  font-weight: 600;
  text-transform: uppercase;
  padding: 10px;
  flex: 0 1 auto;
  background-color: #eeeeee;
`;
