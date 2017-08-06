import React from 'react';
import { FormGroup, Input as ReactstrapInput, InputGroup, InputGroupAddon, ButtonGroup, Button as RButton, Badge } from 'reactstrap';
import { withHandlers, pure } from 'recompose';
import IngredientItem from './IngredientItem';

const Input = pure(ReactstrapInput);
const Button = pure(RButton);

export const IngredientsList = ({ setSearch, search, filterIngredients, showAllIngredients,
                                  ingredients, setSelected, selected,
                                  showSelectedIngredients, showUnselectedIngredients,
                                  checkboxPreventDefault, buyListKeyed, showPlusIngredients, ...props }) => {
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
          <Button active={filterIngredients === '+'} onClick={showPlusIngredients}>
            <small><Badge color="success">1+</Badge></small>
          </Button>
        </ButtonGroup>
      </FormGroup>
      {ingredients.map((i, idx) => (
        <IngredientItem numAdditional={buyListKeyed[i.name]} item={i} key={i.name} setSelected={setSelected} checked={!!selected[i.name]} />
      ))}
    </div>
  )
}

const enhance = withHandlers({
  setSearch: ({ setSearch }) => (e) => setSearch(e.target.value),
  showAllIngredients: ({ setFilterIngredients }) => () => setFilterIngredients(null),
  showPlusIngredients: ({ setFilterIngredients }) => () => setFilterIngredients('+'),
  showSelectedIngredients: ({ setFilterIngredients }) => () => setFilterIngredients(true),
  showUnselectedIngredients: ({ setFilterIngredients }) => () => setFilterIngredients(false),
  checkboxPreventDefault: () => (e) => e.preventDefault(),
});

export default enhance(IngredientsList);