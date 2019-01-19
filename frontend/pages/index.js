import React from 'react';

import Items from '../components/Items';

const Home = props => (
  <div>
    <Items page={parseInt(props.query.page, 10) || 1} />
  </div>
);

export default Home;
