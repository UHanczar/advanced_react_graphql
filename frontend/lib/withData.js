import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
          // rejectUnauthorized: false,
          // strictSSL: false
        },
        headers,
      });
    },
  });
}

export default withApollo(createClient);
