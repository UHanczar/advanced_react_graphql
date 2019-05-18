import React, { Component } from 'react';
import Link from 'next/link';
import { Query } from "react-apollo";
import gql from 'graphql-tag';
import { formatDistance } from 'date-fns';

import formatMoney from '../lib/formatMoney';
import styled from 'styled-components';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import ErrorMessage from '../components/ErrorMessage';

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      charge
      total
      createdAt
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

class OrderList extends Component {
  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {(data, loading, error) => {
          if (error) return <ErrorMessage error={error} />;
          if (loading) return <p>Loading...</p>;

          const { orders } = data.data;
          console.log('ORD', orders);
          return (
            <div>
              <h2>You have {orders.length} orders</h2>

              <OrderUl>
                {orders.map(order => (
                  <OrderItemStyles key={order.id}>
                    <Link href={{ pathname: '/order', query: {id: order.id }}}>
                      <a>
                        <div className='order-meta'>
                          <p>{order.items.reduce((acc, item) => acc + item.quantity, 0)} items</p>
                          <p>{order.items.length} products</p>
                          <p>{formatDistance(order.createdAt, new Date())}</p>
                          <p>{formatMoney(order.total)}</p>
                        </div>

                        <div className="images">
                          {order.items.map(item => <img key={item.id} src={item.image} alt={item.title} />)}
                        </div>
                      </a>
                    </Link>


                  </OrderItemStyles>
                ))}
              </OrderUl>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default OrderList;
