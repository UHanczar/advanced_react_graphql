import React from 'react';
import Head from 'next/head';
import Link  from 'next/link';
import { Query } from "react-apollo";
import gql from 'graphql-tag';

import { perPage } from '../config';
import PaginationStyles from './styles/PaginationStyles';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (

  <Query query={PAGINATION_QUERY}>
    {({ data, loaging, error}) => {
      if (loaging) return (<div>Loading...</div>);

      const { count } = data.itemsConnection.aggregate;
      const pages = Math.ceil(count / perPage);
      const page = props.page;

      return (
        <PaginationStyles>
          <Head>
            <title>Sick Fits! Page {page} of {pages}</title>
          </Head>

          <Link prefetch href={{
            pathname: 'items',
            query: {page: page - 1}
          }}><a className="prev" aria-disabled={page === 1}>Prev</a></Link>

          <div>Page {page} of {pages}</div>

          <div>{count} items total</div>

          <Link prefetch href={{
            pathname: 'items',
            query: {page: page + 1}
          }}><a className="prev" aria-disabled={page >= pages}>Next</a></Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;

