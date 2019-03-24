import React from 'react';

import PleaseSingIn from '../components/PleaseSignIn';
import UserPermissions from '../components/UserPermissions';

const Permissions = props => (
  <PleaseSingIn>
    <UserPermissions />
  </PleaseSingIn>
);

export default Permissions;
