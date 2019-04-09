import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';

import { endpoint } from '../config';
import { TOGGLE_CARD_MUTATION, LOCAL_STATE_QUERY } from "../components/Card";

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    clientState: {
      resolvers: {
        Mutation: {
          toggleCard(_, variables, client) {
            const { cardOpen} = client.cache.readQuery({
              query: LOCAL_STATE_QUERY,
            });
            const data = {
              data: { cardOpen: !cardOpen }
            };

            client.cache.writeData(data);

            return data;
          }
        }
      },
      defaults: {
        cardOpen: false,
      }
    },
  });
}

export default withApollo(createClient);
