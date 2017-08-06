import React from 'react';
import { Table, Col, Row, InputGroup, FormGroup, Input, InputGroupAddon } from 'reactstrap'
import { compose, withStateHandlers, withPropsOnChange, withHandlers } from 'recompose';
import { chain, each, filter, includes, keys } from 'lodash';
import CocktailRow from './CocktailRow';
import Card from './Card';
import IngredientsList from './IngredientsList';

const CocktailIndex = ({ ingredients, name, topFiveYield, recipes, have, filterIngredients,
                         onSelectAllChange, setFilterIngredients, buyList, setSelected, search, setSearch, selected,
                         onAddIngredient, onRemoveIngredient, setCocktailSearch, cocktailSearch, buyListKeyed,
                         ...props }) => {
  return (
    <Row>
      <Col xs={false} sm="4" md="3">
        <Card header="Ingredients" subtitle="Select your available ingredients" toggleKey="ingredients_toggle">
          <IngredientsList {...{ setSearch, search, filterIngredients, setFilterIngredients, ingredients, buyListKeyed, setSelected, selected }} />
        </Card>
      </Col>
      <Col xs={false} sm="8" md="9">
        <Row>
          <Col xs={false} xl={true} className="mt-2 mt-sm-0">
            <Card toggleKey="cocktails_toggle" header={`${name} Cocktails`} subtitle={`You can make ${have} out of ${recipes.length} cocktails`}>
              <FormGroup>
                <InputGroup>
                  <Input type="text" size="sm" placeholder="Search..." onChange={setCocktailSearch} value={cocktailSearch} />
                  <InputGroupAddon>
                    <span className="fa fa-search" />
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <Table size="sm" striped>
                <thead>
                <tr>
                  <th>Name</th>
                  <th colSpan="2">Missing</th>
                </tr>
                </thead>
                <tbody>
                {recipes.map(i => (
                  <CocktailRow selected={selected} onAddIngredient={onAddIngredient} onRemoveIngredient={onRemoveIngredient} key={i.name} item={i} />
                ))}
                </tbody>

              </Table>
            </Card>
          </Col>
          <Col xs={false} xl={true} className="mt-2 mt-xl-0">
            <Card toggleKey="buylist_toggle" header="Buy List" subtitle={`Purchase the top 5 for an additional ${topFiveYield} cocktails`}>
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
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

const enhance = compose(
  withStateHandlers(({ saveKey }) => ({
    selected: JSON.parse(localStorage.getItem(saveKey) || '{}'),
    search: '',
    cocktailSearch: '',
    filterIngredients: null
  }), {
    setSelected: ({ selected }) => (ingredient, value) => ({
      selected: { ...selected, [ingredient]: value },
      dirty: true,
    }),
    setSearch: () => (search) => ({ search }),
    setCocktailSearch: () => (cocktailSearch) => ({ cocktailSearch }),
    setFilterIngredients: () => (filterIngredients) => ({ filterIngredients }),
  }),
  withPropsOnChange(['selected'], ({ selected, recipes, saveKey }) => {
    setTimeout(() => localStorage.setItem(saveKey, JSON.stringify(selected)), 1);
    const list = chain(recipes)
      .sortBy('ingredient')
      .groupBy('name')
      .map((b, name) => {
        let missing = {};

        each(b, ({ ingredient }) => {
          if (!selected[ingredient]) {
            missing[ingredient] = true;
          }
        });

        missing = keys(missing);

        return {
          name: name,
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

    const buyListKeyed = chain(buyList).map(i => ([i.ingredient, i.num])).fromPairs().value();

    const result = {
      recipes: list,
      buyList,
      buyListKeyed,
      have: filter(list, i => i.numMissing === 0).length,
      topFiveYield: chain(buyList).take(5).sumBy(i => i.cocktails.length)
    };

    return result;
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
  withPropsOnChange(['cocktailSearch', 'recipes'], ({ cocktailSearch, recipes }) => {
    let copy = recipes;

    if (cocktailSearch) {
      cocktailSearch = cocktailSearch.toLowerCase();
      copy = filter(copy, i => includes(i.name.toLowerCase(), cocktailSearch))
    }

    return {
      recipes: copy
    }
  }),
  withHandlers({
    setCocktailSearch: ({ setCocktailSearch }) => e => setCocktailSearch(e.target.value),
    onAddIngredient: ({ setSelected }) => (ingredient) => {
      setSelected(ingredient, true);
    },
  })
)

export default enhance(CocktailIndex);
