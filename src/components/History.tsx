import React from 'react';

import { Ul } from './Ul';
import { ButtonRemove } from './Button';
import styled from '../theme/styled-components';

const Item = styled('li')<{ isActive: boolean }>`
  padding: 10px;
  border-bottom: solid 1px;
  border-color: ${props => props.theme.borderColor};
  display: flex;
  justify-content: space-between;
  color: ${props => (props.isActive ? props.theme.primaryColor : '#000')};

  &:hover {
    background-color: ${props => props.theme.secondaryColor};
    cursor: pointer;
    color: #fff;
  }
`;

const HistoryUl = styled(Ul)`
  border-top: solid 1px;
  border-color: ${props => props.theme.borderColor};
`;

export const History: React.StatelessComponent<{
  histories: any[];
  uri: string;
  onSelect: Function;
  onRemove: Function;
}> = ({ histories, uri, onSelect, onRemove }) => (
  <HistoryUl>
    {histories.map(history => (
      <Item
        key={history}
        onClick={() => onSelect(history)}
        isActive={history === uri}
      >
        <span>{history}</span>

        <ButtonRemove
          type="button"
          value="X"
          onClick={event => {
            event.stopPropagation();
            onRemove(history);
          }}
        />
      </Item>
    ))}
  </HistoryUl>
);
