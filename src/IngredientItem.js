import { FormGroup, Label, Input as ReactstrapInput, Badge } from 'reactstrap';
import { withHandlers, pure } from 'recompose';
import React from 'react';

const Input = pure(ReactstrapInput);

export const IngredientItem = ({ setSelected, numAdditional, item, checked, ...props }) => {
  return (
    <FormGroup check>
      <Label check>
        <Input type="checkbox" onChange={setSelected} checked={checked} /> <span>{item.name} {!!numAdditional && <Badge color="success">+{numAdditional}</Badge>}</span>
      </Label>
    </FormGroup>
  )
};

const enhance = withHandlers({
  setSelected: ({ setSelected, item }) => (e) => setSelected(item.name, e.target.checked)
});

export default enhance(IngredientItem);