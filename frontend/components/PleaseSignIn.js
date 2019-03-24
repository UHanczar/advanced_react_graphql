import React from 'react';
import { Query } from "react-apollo";

import { CURRENT_USER_QUERY } from "./User";
import SigninUser from './SigninUser';

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return (<p>Loading...</p>);

      if (!data.user) {
        return (
          <div>
            <p>Please, sing in before continuing.</p>
            <SigninUser />
          </div>
        )
      }

      return props.children;
    }}
  </Query>
);

export default PleaseSignIn;
