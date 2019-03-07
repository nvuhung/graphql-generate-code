import React from 'react';

import { Ul } from './Ul';
import { ButtonRemove } from './Button';
import styled from '../theme/styled-components';
import { LiActive } from './Li';

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
      <LiActive
        key={history}
        onClick={() => onSelect(history)}
        className={history === uri ? 'active' : ''}
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
      </LiActive>
    ))}
  </HistoryUl>
);
