import React from 'react';

import PleaseSingIn from '../components/PleaseSignIn';
import Order from '../components/Order';

const OrderPage = props => (
  <PleaseSingIn>
    <Order id={props.query.id} />
  </PleaseSingIn>
);

export default OrderPage;
