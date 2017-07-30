import { FormGroup, Label, Input as ReactstrapInput } from 'reactstrap';
import { withHandlers, pure } from 'recompose';
import React from 'react';

const Input = pure(ReactstrapInput);

export const IngredientItem = ({ setSelected, item, checked, ...props }) => {
  return (
    <FormGroup check>
      <Label check>
        <Input type="checkbox" onChange={setSelected} checked={checked} /> {item.name}
      </Label>
    </FormGroup>
  )
};

const enhance = withHandlers({
  setSelected: ({ setSelected, item }) => (e) => setSelected(item.name, e.target.checked)
});

export default enhance(IngredientItem);