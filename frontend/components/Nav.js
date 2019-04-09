import React from 'react';
import Link from 'next/link';
import { Mutation } from "react-apollo";
import CardCount from "./CardCount";

import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

import { TOGGLE_CARD_MUTATION } from './Card';

const Nav = () => (
<User>
  {({ data: { user } }) => (
    <NavStyles>
      <Link href='/items'>
        <a>Shop</a>
      </Link>

      {user && (
        <>
          <Link href='/sell'>
            <a>Sell</a>
          </Link>

          <Link href='/orders'>
            <a>Orders</a>
          </Link>

          <Link href='/me'>
            <a>Account</a>
          </Link>

          <Signout />

          <Mutation mutation={TOGGLE_CARD_MUTATION}>
            {(toggleCard) => (
              <button onClick={toggleCard}>
                My card
                <CardCount
                  count={user.card.reduce((tally, item) => tally + item.quantity, 0)}
                />
              </button>
            )}
          </Mutation>
        </>
      )}

      {!user && (
        <Link href='/signup'>
          <a>Signup</a>
        </Link>
      )}
    </NavStyles>
  )}
</User>
);

export default Nav;
