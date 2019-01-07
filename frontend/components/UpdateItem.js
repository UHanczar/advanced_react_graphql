import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation, Query } from "react-apollo";
import gql from 'graphql-tag';

import Error from './ErrorMessage';
import Form from './styles/Form';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price 
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!    
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id,
      title,
      description,
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {
  };

  handleChange = (event) => {
    const {name, value} = event.target;

    this.setState({
      [name]: value,
    });
  };

  updateItem = async (event, updateItemMutation) => {
    event.preventDefault();

    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      }
    });
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading}) => {
          if (loading) return <div>Loading...</div>;
          if (!data.item) return <div>No data found...</div>;

          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, {error, loading}) => (
                <Form onSubmit={(event) => this.updateItem(event, updateItem)}>
                  <h2>Sell an item</h2>

                  <Error error={error}/>

                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
                        required
                      />
                    </label>

                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                        required
                      />
                    </label>

                    <label htmlFor="description">
                      Description
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter A Description"
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>

                    <button type="submit">Save changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>)
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export {UPDATE_ITEM_MUTATION};
