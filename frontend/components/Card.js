import React from 'react';
import { adopt } from 'react-adopt';
import { Query, Mutation } from "react-apollo";
import gql from 'graphql-tag';

import User from './User';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import CardItem from './CardItem';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import TakeMyMoney from './TakeMyMoney';

const LOCAL_STATE_QUERY = gql`
  query {
    cardOpen @client
  }
`;

const TOGGLE_CARD_MUTATION = gql`
  mutation {
    toggleCard @client
  }
`;

const Composed = adopt({
  userData: ({ render }) => <User>{render}</User>,
  toggleCard: ({ render }) => <Mutation mutation={TOGGLE_CARD_MUTATION}>{render}</Mutation>,
  localState:  ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Card = props => {
  return (
    <Composed>
      {({ userData, toggleCard, localState }) => {
        const { user } = userData.data;

        if (!user) return null;

        return (
          <CartStyles open={localState.data.cardOpen}>
            <header>
              <CloseButton title='Close' onClick={toggleCard}>&times;</CloseButton>
              <Supreme>{user.name}'s card</Supreme>

              <p>You have {user.card.length} item{user.card.length > 1 ? 's' : ''} in your card</p>
            </header>

            <ul>{user.card.map(cardItem => (
              <CardItem key={cardItem.id}  cardItem={cardItem} />
            ))}</ul>

            <footer>
              <p>{formatMoney(calcTotalPrice(user.card))}</p>

              {user.card.length &&
                <TakeMyMoney>
                  <SickButton>Checkout</SickButton>
                </TakeMyMoney>
              }
            </footer>
          </CartStyles>
        );
      }}
    </Composed>
  );
};

export { LOCAL_STATE_QUERY, TOGGLE_CARD_MUTATION};
export default Card;

