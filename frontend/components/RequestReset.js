import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {
  state = {
    email: '',
  };

  saveToState = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitUserData = async (event, reset) => {
    event.preventDefault();
    await reset();

    this.setState({ email: '' });
  };

  render() {
    return (
      <Mutation
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}
      >
        {(reset, { loading, error, called }) => (
          <Form method='post' onSubmit={(e) => this.submitUserData(e, reset)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request a password reset</h2>

              <ErrorMessage error={error} />

              {!error && !loading && called && (
                <p>Success! Check your email for a reset link</p>
              )}

              <label htmlFor='email'>
                Email
                <input
                  type='text'
                  name='email'
                  placeholder='Email'
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>

              <button type='submit'>Request Reset</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default RequestReset;
