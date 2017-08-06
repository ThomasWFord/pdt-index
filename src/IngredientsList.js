import React from 'react';
import { FormGroup, Input as ReactstrapInput, InputGroup, InputGroupAddon, ButtonGroup, Button as RButton, Label } from 'reactstrap';
import { withHandlers, pure } from 'recompose';
import IngredientItem from './IngredientItem';

const Input = pure(ReactstrapInput);
const Button = pure(RButton);

export const IngredientsList = ({ setSearch, search, filterIngredients, showAllIngredients,
                                  onSelectAllChange, ingredients, setSelected, selected,
                                  showSelectedIngredients, showUnselectedIngredients,
                                  checkboxPreventDefault, ...props }) => {
  return (
    <div>
      <FormGroup>
        <InputGroup>
          <Input type="text" size="sm" placeholder="Search..." onChange={setSearch} value={search} />
          <InputGroupAddon>
            <span className="fa fa-search" />
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <ButtonGroup>
          <Button active={filterIngredients === null} onClick={showAllIngredients}>*</Button>{' '}
          <Button active={filterIngredients === true} onClick={showSelectedIngredients}>
            <input type="checkbox" readOnly checked /></Button>{' '}
          <Button active={filterIngredients === false} onClick={showUnselectedIngredients}>
            <input type="checkbox" readOnly onClick={checkboxPreventDefault} />
          </Button>
        </ButtonGroup>
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input type="checkbox" onChange={onSelectAllChange} />
        </Label>
      </FormGroup>
      {ingredients.map((i, idx) => (
        <IngredientItem item={i} key={i.name} setSelected={setSelected} checked={!!selected[i.name]} />
      ))}
    </div>
  )
}

const enhance = withHandlers({
  setSearch: ({ setSearch }) => (e) => setSearch(e.target.value),
  showAllIngredients: ({ setFilterIngredients }) => () => setFilterIngredients(null),
  showSelectedIngredients: ({ setFilterIngredients }) => () => setFilterIngredients(true),
  showUnselectedIngredients: ({ setFilterIngredients }) => () => setFilterIngredients(false),
  onSelectAllChange: ({ onSelectAllChange }) => (e) => onSelectAllChange(e.target.checked),
  checkboxPreventDefault: () => (e) => e.preventDefault(),
});

export default enhance(IngredientsList);