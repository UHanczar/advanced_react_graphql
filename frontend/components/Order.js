import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Query } from "react-apollo";
import gql from 'graphql-tag';
import { format } from 'date-fns';

import formatMoney from '../lib/formatMoney';
import OrderStyles from '../components/styles/OrderStyles';
import ErrorMessage from '../components/ErrorMessage';


const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
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


class Order extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  render() {
    return (
    <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id }}>
      {({ data, error, loading }) => {
        if (error) return <ErrorMessage error={error} />;
        if (loading) return <p>Loading...</p>;

        const { order } = data;
        return (
          <OrderStyles>
            <Head>
              <title>Sick Fits - order: {order.id}</title>
            </Head>
            <p>
              <span>Orderid:</span>
              <span>{this.props.id}</span>
            </p>

            <p>
              <span>Charge:</span>
              <span>{order.charge}</span>
            </p>

            <p>
              <span>Dage:</span>
              <span>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</span>
            </p>

            <p>
              <span>Total:</span>
              <span>{formatMoney(order.total)}</span>
            </p>

            <p>
              <span>Count:</span>
              <span>{order.items.length}</span>
            </p>

            <div className="items">
              {order.items.map(item => (
                <div className="order-item" key={item.id}>
                  <img height='auto' src={item.image} alt={item.title} />

                  <div className='item-details'>
                    <h2>{item.title}</h2>

                    <p>Qty: {item.quantity}</p>
                    <p>Each: {item.price}</p>
                    <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </OrderStyles>
        );
      }}
    </Query>
    );
  }
}

export default Order;
