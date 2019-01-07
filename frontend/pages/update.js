import React from 'react';

import UpdateItem from '../components/UpdateItem';

const Update = ({ query }) => (
  <UpdateItem id={query.id} />
);

export default Update;
