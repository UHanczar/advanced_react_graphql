import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from "react-apollo";
import gql from 'graphql-tag';

import DisplayError from "./ErrorMessage";
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const POSSIBLE_PERMISSIONS = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id,
      permissions,
      name,
      email
    }
  }
`;

const ALL_USERS_QUERY = gql`
  query {
    users {
      id,
      name,
      email,
      permissions,
    }
  }
`;

const UserPermissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error}) => (
      <div>
        <DisplayError error={error} />

        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {POSSIBLE_PERMISSIONS.map((permission, i) => <th key={`permission-{${permission+i}`}>{permission}</th>)}
              <th>+</th>
            </tr>
          </thead>

          <tbody>
            {data.users.map(user => (
              <PermissionUser key={user.id} user={user} />
            ))}
          </tbody>
        </Table>
      </div>
      )}
  </Query>
);

class PermissionUser extends Component {
  state = {
    permissions: this.props.user.permissions,

  };

  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };

  handlePermissionChange = (e) => {
    const checkbox = e.target;
    let updatedPermissions = [...this.state.permissions];

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
    }

    this.setState({
      permissions: updatedPermissions,
    });
  };

  render() {
    const { user } = this.props;

    return (
      <Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={{
        permissions: this.state.permissions,
        userId: user.id,
      }}>
        {(updatePermissions, { loading, error }) => (
          <>
            {error && <tr><td><DisplayError error={error} /></td></tr>}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {POSSIBLE_PERMISSIONS.map((permission, i) => (
                <td key={`${user.id}-permission-{${permission+i}`}>
                  <label htmlFor={`${user.id}-permission-{${permission+i}`}>
                    <input
                      id={`${user.id}-permission-{${permission+i}`}
                      type="checkbox"
                      checked={this.state.permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton
                  type='button'
                  disabled={loading}
                  onClick={updatePermissions}
                >Update</SickButton>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    )
  }
}

export default UserPermissions;
