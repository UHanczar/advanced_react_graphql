import React, {Component} from 'react';
import Head from 'next/head';
import { Query } from "react-apollo";
import gql from 'graphql-tag';
import styled from 'styled-components';

import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage  
    }
  }
`;

const SingleItemStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: 1200px;
  min-height: 800px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

class SingleItem extends Component {
  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data: { item }, error, loading }) => {
          if (error) return (<Error error={error} />);
          if (loading) return (<p>Loading</p>);
          if (!item) return (<p>No data found for {this.props.id}!</p>);

          return (
            <SingleItemStyles>
              <Head>
                <title>Sick Fits | {item.title}</title>
              </Head>

              <img src={item.largeImage} alt={item.title} />

              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>Item description</p>
              </div>
            </SingleItemStyles>
          );
        }}
      </Query>
    );
  }
}

export default SingleItem;
