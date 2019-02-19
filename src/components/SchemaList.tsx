import React from 'react';

import styled from '../theme/styled-components';
import { Ul } from './Ul';

const Container = styled.div`
  height: 100%;
`;

const SchemaContainer = styled('div')<{ hasBorder?: boolean }>`
  display: flex;
  flex-flow: column;
  height: 50%;
  border-top: solid ${props => props.theme.borderColor};
  border-width: ${props => (props.hasBorder ? '1px' : 0)};
`;

const SchemaHeader = styled.div`
  color: rgba(0, 0, 0, 0.3);
  cursor: default;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  user-select: none;
  padding: 10px;
  flex: 0 1 auto;
`;

const SchemaUl = styled(Ul)`
  flex: 1 1 auto;
  overflow: auto;
`;

const SchemaLi = styled.li`
  padding: 10px;

  &:hover {
    background-color: ${props => props.theme.secondaryColor};
    cursor: pointer;
    color: #fff;
  }
`;

const List: React.StatelessComponent<{
  type: 'query' | 'mutation';
  hasBorder?: boolean;
  list: any[];
  onSelect: Function;
}> = ({ type, hasBorder, list, onSelect }) => (
  <SchemaContainer hasBorder={hasBorder}>
    <SchemaHeader>
      {type} ({list.length})
    </SchemaHeader>

    <SchemaUl>
      {list.map(schema => (
        <SchemaLi onClick={() => onSelect(type, schema)} key={schema.name}>
          {schema.name}
        </SchemaLi>
      ))}
    </SchemaUl>
  </SchemaContainer>
);

export const SchemaList: React.StatelessComponent<{
  queries: any[];
  mutations: any[];
  onSelect: Function;
}> = ({ queries, mutations, onSelect }) => (
  <Container>
    <List type="query" list={queries} onSelect={onSelect} />
    <List
      hasBorder={true}
      type="mutation"
      list={mutations}
      onSelect={onSelect}
    />
  </Container>
);
