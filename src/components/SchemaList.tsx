import React from 'react';

import styled from '../theme/styled-components';
import { Ul } from './Ul';
import { SchemaContainer, SchemaHeader } from './Wrapper';
import { LiActive } from './Li';

const Container = styled.div`
  height: calc(100% - 55px);
`;

const SchemaUl = styled(Ul)`
  flex: 1 1 auto;
  overflow: auto;
`;

const List: React.StatelessComponent<{
  type: 'query' | 'mutation';
  hasBorder?: boolean;
  list: any[];
  onSelect: Function;
  schemaType: string;
  schemaNameSelected: string;
}> = ({ type, hasBorder, list, onSelect, schemaType, schemaNameSelected }) => (
  <SchemaContainer hasBorder={hasBorder}>
    <SchemaHeader>
      {type} ({list.length})
    </SchemaHeader>

    <SchemaUl>
      {list.map(schema => (
        <LiActive
          onClick={() => onSelect(type, schema)}
          key={schema.name}
          className={
            schemaType === type && schemaNameSelected === schema.name
              ? 'active'
              : ''
          }
        >
          {schema.name}
        </LiActive>
      ))}
    </SchemaUl>
  </SchemaContainer>
);

export const SchemaList: React.StatelessComponent<{
  queries: any[];
  mutations: any[];
  onSelect: Function;
  schemaType: string;
  schemaNameSelected: string;
}> = ({ queries, mutations, onSelect, schemaType, schemaNameSelected }) => (
  <Container>
    <List
      schemaType={schemaType}
      schemaNameSelected={schemaNameSelected}
      type="query"
      list={queries}
      onSelect={onSelect}
    />

    <List
      schemaType={schemaType}
      schemaNameSelected={schemaNameSelected}
      hasBorder={true}
      type="mutation"
      list={mutations}
      onSelect={onSelect}
    />
  </Container>
);
