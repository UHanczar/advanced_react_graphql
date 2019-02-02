import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from "./User";

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!) {
        signin(email: $email, password: $password) {
            id
            email
            name
        }
    }
`;

class SigninUser extends Component {
  state = {
    email: '',
    password: '',
  };

  saveToState = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitUserData = async (event, signup) => {
    event.preventDefault();
    await signup();

    this.setState({ email: '', password: '' });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { loading, error }) => (
          <Form method='post' onSubmit={(e) => this.submitUserData(e, signin)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign into your account</h2>

              <ErrorMessage error={error} />

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

              <label htmlFor='password'>
                Password
                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>

              <button type='submit'>Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default SigninUser;
