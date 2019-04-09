import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import formatMoney from '../lib/formatMoney';
import RemoveFromCard from './RemoveFromCard';

const CardItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;

  img {
    margin-right: 10px;
  }

  h3, p {
    margin: 0;
  }
`;

const CardItem = ({ cardItem }) => {
  if (!cardItem.item) {
    return (
      <CardItemStyles>
        <p>The item has been removed.</p>
      </CardItemStyles>
    );
  }

  return (
    <CardItemStyles>
      <img width="100px" src={cardItem.item.image} alt={cardItem.item.title} />

      <div className='card-item-details'>
        <h3>{cardItem.item.title}</h3>

        <p>
          {formatMoney(cardItem.item.price * cardItem.quantity)}

          {' - '}

          <em>
            {cardItem.quantity} &times; {cardItem.item.price} each
          </em>
        </p>
      </div>

      <RemoveFromCard id={cardItem.id} />
    </CardItemStyles>
  );
};

CardItem.propTypes = {
  cardItem: PropTypes.object.isRequired,
};

export default CardItem;

