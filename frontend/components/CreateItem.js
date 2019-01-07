import React, {Component} from 'react';
import Router from 'next/router';
import {Mutation} from "react-apollo";
import gql from 'graphql-tag';

import Error from './ErrorMessage';
import Form from './styles/Form';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  };

  handleChange = (event) => {
    const {name, type, value} = event.target;
    const transformedValue = type === 'number' ? parseFloat(value) : value;

    this.setState({
      [name]: transformedValue,
    });
  };

  uploadFile = async (event) => {
    const files = event.target.files;

    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const res = await fetch('http://api.cloudinary.com/v1_1/djochmrxh/image/upload', {
      method: 'POST',
      body: data,
    });

    const file = await res.json();

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  };

  handleSubmit = async (event, createItem) => {
    event.preventDefault();

    const res = await createItem();

    Router.push({
      pathname: '/item',
      query: {id: res.data.createItem.id}
    })
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, {error, loading}) => (
          <Form onSubmit={(event) => this.handleSubmit(event, createItem)}>
            <h2>Sell an item</h2>

            <Error error={error}/>

            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  onChange={this.uploadFile}
                  required
                />

                {this.state.image && <img src={this.state.image} alt={this.state.image} />}
              </label>

              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={this.state.title}
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
                  value={this.state.price}
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
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>

              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export {CREATE_ITEM_MUTATION};
