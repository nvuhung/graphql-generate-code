import React from 'react';

import styled from '../theme/styled-components';

const HeaderStyled = styled.div`
  text-align: center;
  height: 50px;
`;

export const Header = () => (
  <HeaderStyled>
    <h1>GraphQL Generate Code</h1>
  </HeaderStyled>
);
