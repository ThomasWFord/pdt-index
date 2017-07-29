import React from 'react';
import { FormGroup, Label, Input, ButtonGroup, Button, InputGroup, InputGroupAddon, Table } from 'reactstrap'
import { compose, withStateHandlers, withPropsOnChange, withHandlers } from 'recompose';
import { chain, sortBy, each, filter, includes } from 'lodash';
import CocktailRow from './CocktailRow';
import Card from './Card';

const CocktailIndex = ({ ingredients, name, dirty, topFiveYield, onSaveChanges, recipes, have, filterIngredients, onSelectAllChange, setFilterIngredients, buyList, setSelected, search, setSearch, selected, ...props }) => {
  return (
    <div className="row">
      <div className="col-md-3 col-lg-3 col-xl-2">
        <Card title="Ingredients">
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
        </Card>
      </div>
      <div className="col mt-2 mt-sm-0">
        <Card title={`${name} Cocktails`} subtitle={`You can make ${have} out of ${recipes.length} cocktails`}>
          <Table size="sm" striped>
            <thead>
            <tr>
              <th>Name</th>
              <th colSpan="2">Missing</th>
            </tr>
            </thead>
            <tbody>
            {recipes.map(i => (
              <CocktailRow key={i.name} item={i} />
            ))}
            </tbody>

          </Table>
        </Card>
      </div>
      <div className="col mt-2 mt-sm-0">
        <Card title="Buy List" subtitle={`Purchase the top 5 for an additional ${topFiveYield} cocktails`}>
          <Table size="sm" striped>
            <thead>
            <tr>
              <th>Ingredient</th>
              <th colSpan="2">Cocktails</th>
            </tr>
            </thead>
            <tbody>
            {buyList.map(i => (
              <tr key={i.ingredient}>
                <td>{i.ingredient}</td>
                <td>{i.num}</td>
                <td>{i.cocktails.join('; ')}</td>
              </tr>
            ))}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

const enhance = compose(
  withStateHandlers(({ saveKey }) => ({
    selected: JSON.parse(localStorage.getItem(saveKey) || '{}'),
    search: '',
    filterIngredients: null
  }), {
    setSelected: ({ selected }) => (ingredient, value) => ({
      selected: { ...selected, [ingredient]: value },
      dirty: true,
    }),
    setBulkSelected: () => (selected) => ({ selected, dirty: true }),
    setSearch: () => (search) => ({ search }),
    setFilterIngredients: () => (filterIngredients) => ({ filterIngredients }),
    onSaveChanges: ({ selected }, { saveKey }) => () => {
      localStorage.setItem(saveKey, JSON.stringify(selected));
      return { dirty: false };
    }
  }),
  withPropsOnChange(['selected'], ({ selected, recipes }) => {
    let nameIndex = 0;
    const list = chain(recipes)
      .sortBy('ingredient')
      .groupBy('name')
      .map((b, name) => {
        const missing = [];

        each(b, ({ ingredient }) => {
          if (!selected[ingredient]) {
            missing.push(ingredient);
          }
        });

        return {
          name: name,
          index: nameIndex++,
          page: b[0].page,
          numMissing: missing.length,
          missing,
          raw: b,
        };
      })
      .orderBy(['numMissing', 'name'])
      .value();

    const buyList = chain(list)
      .filter(i => i.numMissing === 1)
      .groupBy('missing')
      .map((i, key) => ({ ingredient: key, num: i.length, cocktails: chain(i).map('name').sortBy().value() }))
      .orderBy(['num', 'ingredient'], ['desc', 'asc']).value();

    return {
      recipes: list,
      buyList,
      have: filter(list, i => i.numMissing === 0).length,
      topFiveYield: chain(buyList).take(5).sumBy(i => i.cocktails.length)
    }
  }),
  withPropsOnChange(['search', 'filterIngredients'], ({ search, ingredients, filterIngredients, selected }) => {
    let copy = ingredients;

    if (search) {
      search = search.toLowerCase();
      copy = filter(copy, i => includes(i.name.toLowerCase(), search));
    }
    if (filterIngredients !== null) {
      copy = filter(copy, i => (filterIngredients ? selected[i.name] : !selected[i.name]));
    }

    return {
      ingredients: copy,
    }
  }),
  withHandlers({
    onSelectAllChange: ({ setBulkSelected, ingredients, selected }) => (value) => {
      const copy = {...selected};
      each(ingredients, i => {
        copy[i.name] = value;
      });
      setBulkSelected(copy);
    }
  })
)

export default enhance(CocktailIndex);
