import React from 'react';

import styled from '../theme/styled-components';

const HeaderStyled = styled.div`
  text-align: center;
  height: 60px;
`;

export const Header = () => (
  <HeaderStyled>
    <h1>GraphQL Generate Code</h1>
  </HeaderStyled>
);
