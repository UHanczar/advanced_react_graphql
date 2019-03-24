import React from 'react';

import CreateItem from '../components/CreateItem';
import PleaseSingIn from '../components/PleaseSignIn';

const Sell = props => (
  <PleaseSingIn>
    <CreateItem />
  </PleaseSingIn>
);

export default Sell;
