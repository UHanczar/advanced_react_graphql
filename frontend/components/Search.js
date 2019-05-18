import React, { Component } from 'react';
import Router from 'next/router';
import Downshift, { resetIdCounter } from 'downshift';
import { ApolloConsumer } from "react-apollo";
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';

import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(where: {
      OR: [
        { title_contains: $searchTerm },
        { description_contains: $searchTerm },
      ]
    }) {
      id
      image
      title
    }
  }
`;

class AutoComplete extends Component {

  state = {
    loading: false,
    items: [],
  };

  onInputChange = debounce(async (event, client) => {

    this.setState({
      loading: true,
    });
    const response = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: event.target.value },
    });

    this.setState({
      items: response.data.items,
      loading: false,
    })
  }, 350);

  routeToItem = item => {
    Router.push({
      pathname: '/item',
      query: {
        id: item.id,
      }
    })
  };

  render() {
    resetIdCounter();

    return (
      <SearchStyles>
        <Downshift
          itemToString={item => item === null ? '' : item.title}
          onChange={item => this.routeToItem(item)}
        >
          {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search for an item',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: event => {
                      event.persist();
                      this.onInputChange(event, client)
                    }
                    })}
                  />
                )}
              </ApolloConsumer>

              {isOpen && (
                <DropDown>
                  {this.state.items.map((item, i) => (
                    <DropDownItem
                      key={item.id}
                      {...getItemProps({ item })}
                      highlighted={i === highlightedIndex}
                    >
                      <img width='50' src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}

                  {!this.state.items.length && !this.state.loading && (
                    <DropDownItem>Nothing Found for {inputValue}</DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    )
  }
}

export default AutoComplete;

