import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from 'graphql-tag';
import styled from 'styled-components';

import { perPage } from "../config";
import Item from './Item';
import Pagination from './Pagination';

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($first: Int = ${perPage}, $skip: Int = 0) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`;

const ContentCenter = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class Items extends Component {
  render() {
    return (
      <ContentCenter>
        <Pagination page={this.props.page} />
        <Query
          query={ALL_ITEMS_QUERY}
          variables={{ skip: this.props.page * perPage - perPage }}
          fetchPolicy='network-only' // see other solutions
        >
          {({ data, error, loading }) => {
            if (loading) return <div>Loading</div>;
            if (error) return <div>{error.message}</div>
            return (
              <ItemsList>
                {data.items.map(item => (
                  <Item key={item.id} item={item} />
                ))}
              </ItemsList>
            );
          }}
        </Query>
        <Pagination page={this.props.page} />
      </ContentCenter>
    )
  }
}

export default Items;
export { ALL_ITEMS_QUERY };
