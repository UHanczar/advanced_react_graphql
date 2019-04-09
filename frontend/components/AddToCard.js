import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from "./User";

const ADD_TO_CARD_MUTATION = gql`
  mutation ADD_TO_CARD_MUTATION($id: ID!) {
    addToCard(id: $id) {
      id
      quantity
    }
  }
`;

class AddToCard extends Component {
  render() {
    const { id } = this.props;

    return (
      <Mutation mutation={ADD_TO_CARD_MUTATION} variables={{ id }} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(addToCard, {error, loading }) => (
          <button disabled={loading} onClick={addToCard}>Add{loading && 'ing'} to card</button>
        )}
      </Mutation>
    );
  }
}

export default AddToCard;
