import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from "./User";

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name  
    }
  }
`;

class SignupUser extends Component {
  state = {
    email: '',
    name: '',
    password: '',
  };

  saveToState = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitUserData = async (event, signup) => {
    event.preventDefault();
    await signup();

    this.setState({ email: '', name: '', password: '' });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { loading, error }) => (
          <Form method='post' onSubmit={(e) => this.submitUserData(e, signup)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign up for an account</h2>

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

              <label htmlFor='name'>
                Name
                <input
                  type='text'
                  name='name'
                  placeholder='Name'
                  value={this.state.name}
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

export default SignupUser;
