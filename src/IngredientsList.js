import React from 'react';
import { FormGroup, Input, InputGroup, InputGroupAddon, ButtonGroup, Button, Label } from 'reactstrap'

export const IngredientsList = ({ setSearch, search, filterIngredients, setFilterIngredients, onSaveChanges,
                                  dirty, onSelectAllChange, ingredients, setSelected, selected, ...props }) => {
  return (
    <div>
      <FormGroup>
        <InputGroup>
          <Input type="text" size="sm" placeholder="Search..." onChange={e => setSearch(e.target.value)} value={search} />
          <InputGroupAddon>
            <span className="fa fa-search" />
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <ButtonGroup>
          <Button active={filterIngredients === null} onClick={() => setFilterIngredients(null)}>*</Button>{' '}
          <Button active={filterIngredients === true} onClick={() => setFilterIngredients(true)}>
            <input type="checkbox" readOnly checked /></Button>{' '}
          <Button active={filterIngredients === false} onClick={() => setFilterIngredients(false)}>
            <input type="checkbox" readOnly onClick={e => e.preventDefault()} />
          </Button>
        </ButtonGroup>
      </FormGroup>
      {dirty && <FormGroup>
        <Button size="sm" onClick={onSaveChanges} className="btn-block"><i className="fa fa-save" /> Save changes</Button>
      </FormGroup>}
      <FormGroup check>
        <Label check>
          <Input type="checkbox" onChange={e => onSelectAllChange(!!e.target.checked)} />
        </Label>
      </FormGroup>
      {ingredients.map((i, idx) => (
        <FormGroup key={idx} check>
          <Label check>
            <Input type="checkbox" onChange={e => setSelected(i.name, e.target.checked)} checked={!!selected[i.name]} /> {i.name}
          </Label>
        </FormGroup>
      ))}
    </div>
  )
}

export default IngredientsList;