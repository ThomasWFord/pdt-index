import { Badge, ListGroupItem } from 'reactstrap';
import { withHandlers } from 'recompose';
import React from 'react';

export const IngredientItem = ({ toggleSelected, numAdditional, item, checked, ...props }) => {
  return (
    <ListGroupItem active={checked} action onClick={toggleSelected} className="justify-content-between">
      {item.name} {!!numAdditional && <Badge color="success">+{numAdditional}</Badge>}
      </ListGroupItem>
  )
};

const enhance = withHandlers({
  toggleSelected: ({ setSelected, item, checked }) => (e) => setSelected(item.name, !checked)
});

export default enhance(IngredientItem);