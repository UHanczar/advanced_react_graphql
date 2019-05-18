import React, { Component } from 'react';
import ProTypes from 'prop-types';
import Router from 'next/router';
import { Mutation } from "react-apollo";
import gql from 'graphql-tag';
import StripeCheckout from 'react-stripe-checkout';
import NProgress from 'nprogress';

import calcTotalPrice from '../lib/calcTotalPrice';
import ErrorMessage from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from "./User";


const totalItems = (card) => card.reduce((tally, cardItem) => tally + cardItem.quantity, 0);

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

class TakeMyMoney extends Component {
  onTokenReceived = async (res, createOrder) => {
    NProgress.start();
    const order = await createOrder({
      variables: {
        token: res.id
      }
    })
      .catch(error => alert(error.message));

    Router.push({
      pathname: '/order',
      query: {
        id: order.data.createOrder.id,
      }
    })
  };

  render() {
    return (
      <User>
        {({ data: { user }}) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >{createOrder => (
            <StripeCheckout
              name='Sick Fits'
              description={`Order of ${totalItems(user.card)} items`}
              image={user.card.length && user.card[0].item && user.card[0].item.image}
              amount={calcTotalPrice(user.card)}
              stripeKey='pk_test_HVNIpjjJ0OzLMEk9KJ2bLsql'
              currency='USD'
              email={user.email}
              token={res => this.onTokenReceived(res, createOrder)}
            >
              {this.props.children}
            </StripeCheckout>
          )}</Mutation>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
