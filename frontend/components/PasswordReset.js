import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from "./User";

const PASSWORD_RESET_MUTATION = gql`
    mutation PASSWORD_RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
        resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
            id,
            email,
            name
        }
    }
`;

class PasswordReset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  };

  state = {
    password: '',
    confirmPassword: '',
  };

  saveToState = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitUserData = async (event, reset) => {
    event.preventDefault();
    await reset();

    this.setState({ password: '', confirmPassword: '' });
  };

  render() {
    return (
      <Mutation
        mutation={PASSWORD_RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(reset, { loading, error, called }) => (
          <Form method='post' onSubmit={(e) => this.submitUserData(e, reset)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Your Password</h2>

              <ErrorMessage error={error} />

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

              <label htmlFor='password'>
                Confirm Your Password
                <input
                  type='password'
                  name='confirmPassword'
                  placeholder='Confirm Password'
                  value={this.state.confirmPassword}
                  onChange={this.saveToState}
                />
              </label>

              <button type='submit'>Reset</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default PasswordReset;
