import React from 'react';

import PleaseSingIn from '../components/PleaseSignIn';
import OrderList from '../components/OrderList';

const OrdersPage = props => (
  <PleaseSingIn>
    <OrderList />
  </PleaseSingIn>
);

export default OrdersPage;
