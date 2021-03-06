import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import formatMoney from './../lib/formatMoney';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import DeleteItem from "./DeleteItem";
import AddToCard from './AddToCard';

class Item extends Component {
  static propTypes = {
    item: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string,
      largeImage: PropTypes.string,
    }),
  };

  render() {
    const { item } = this.props;
    return (
      <ItemStyles>
        {item.image && <img src={item.image} alt={item.image} />}
        <Title>
          <Link
            href={{
              pathname: '/item',
              query: { id: item.id }
            }}
          >
            <a>{item.title}</a>
          </Link>
        </Title>

        <PriceTag>{formatMoney(item.price)}</PriceTag>

        <p>{item.description}</p>

        <div className='buttonList'>
          <Link
            href={{
              pathname: '/update',
              query: { id: item.id }
            }}
          >
            <a>Edit ✎</a>
          </Link>

          <AddToCard id={item.id} />

          <DeleteItem id={item.id}>Delete this item</DeleteItem>
        </div>
      </ItemStyles>
    );
  }
}

export default Item;
