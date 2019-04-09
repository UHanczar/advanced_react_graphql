import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from "react-apollo";
import styled from 'styled-components';

import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CARD_MUTATION = gql`
  mutation removeFromCard($id: ID!) {
    removeFromCard(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  border: none;
  background: none;
  
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

class RemoveFromCard extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  update = (cache, payload) => {
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    const cardItemId = payload.data.removeFromCard.id;

    data.user.card = data.user.card.filter(item => item.id !== cardItemId);

    cache.writeQuery({
      query: CURRENT_USER_QUERY,
      data,
    });
  };

  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CARD_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
        optimisticResponse={{
          __typeName: 'Mutation',
          removeFromCard: {
            __typename: "CardItem",
            id: this.props.id,
          }
        }}
      >
        {(removeFromCard, { loading, error }) => (
          <BigButton
            title='Delete item'
            disabled={loading}
            onClick={() => {
              removeFromCard().catch(err => alert(err.message));
            }}
          >&times;</BigButton>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCard;
