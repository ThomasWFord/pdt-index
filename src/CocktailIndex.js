import React from 'react';
import { Table, Col, Row, InputGroup, FormGroup, InputGroupAddon } from 'reactstrap'
import { compose, withStateHandlers, withPropsOnChange, withHandlers } from 'recompose';
import { chain, each, filter, includes, keys, map } from 'lodash';
import CocktailRow from './CocktailRow';
import Card from './Card';
import IngredientsList from './IngredientsList';
import IndexItem from './IndexItem';
import DebounceInput from 'react-debounce-input';
import _ from 'lodash';

const CocktailIndex = ({ ingredients, name, topFiveYield, recipes, have, filterIngredients,
                         setFilterIngredients, buyList, setSelected, search, setSearch, selected,
                         onAddIngredient, onRemoveIngredient, setCocktailSearch, cocktailSearch, buyListKeyed,
                         clearCocktailSeatch, setSelectedIndex, selectedIndexes, indexes, ...props }) => {
  return (
    <Row>
      <Col xs={false} md="5" lg="4" xl="3">
        <Card header="Indexes" className="mb-2" subtitle="Select the book indexes you want to see" toggleKey="indexes_toggle">
          {indexes.map(i => (
            <IndexItem setSelectedIndex={setSelectedIndex} key={i.name} item={i} selected={!!selectedIndexes[i.name]} />
          ))}
        </Card>
        <Card header="Ingredients" subtitle="Select your ingredients" toggleKey="ingredients_toggle">
          <IngredientsList {...{ setSearch, search, filterIngredients, setFilterIngredients, ingredients, buyListKeyed, setSelected, selected }} />
        </Card>
      </Col>


      <Col xs={false} md="7" lg="8" xl="9">
        <Row>
          <Col xs={false} xl={true} className="mt-2 mt-md-0">
            <Card toggleKey="cocktails_toggle" header={name ? `${name} Cocktails` : 'Cocktails'} subtitle={`You can make ${have} out of ${recipes.length} cocktails`}>
              <FormGroup>
                <InputGroup>
                  <DebounceInput debounceTimeout={1000} placeholder="Search..." onChange={setCocktailSearch} value={cocktailSearch} className="form-control" />
                  {!cocktailSearch ? (
                    <InputGroupAddon>
                      <span className="fa fa-search" />
                    </InputGroupAddon>
                    ) : (
                  <InputGroupAddon>
                    <span className="fa fa-times" onClick={clearCocktailSeatch} />
                  </InputGroupAddon>
                    )}
                </InputGroup>
              </FormGroup>
              <Table size="sm" striped>
                <thead>
                <tr>
                  <th>Name</th>
                  <th></th>
                  <th className="hidden-sm-down">Page</th>
                  <th colSpan="2">Missing</th>
                </tr>
                </thead>
                <tbody>
                {recipes.map(i => (
                  <CocktailRow selected={selected} onAddIngredient={onAddIngredient} onRemoveIngredient={onRemoveIngredient} key={i.key} item={i} />
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

const loadOrDefault = (key, defaultValue) => JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));

const enhance = compose(
  withStateHandlers(({ saveKey, indexes }) => ({
    selected: loadOrDefault(saveKey, {}),
    search: '',
    selectedIndexes: loadOrDefault('selectedIndexes', _.fromPairs(map(indexes, i => [i.name, true]))),
    cocktailSearch: '',
    filterIngredients: null
  }), {
    setSelected: ({ selected }) => (ingredient, value) => ({
      selected: { ...selected, [ingredient]: value },
      dirty: true,
    }),
    setSelectedIndex: ({ selectedIndexes }) => (index, value) => ({
      selectedIndexes: { ...selectedIndexes, [index]: value }
    }),
    setSearch: () => (search) => ({ search }),
    clearCocktailSeatch: () => () => ({ cocktailSearch: '' }),
    setCocktailSearch: () => (cocktailSearch) => ({ cocktailSearch }),
    setFilterIngredients: () => (filterIngredients) => ({ filterIngredients }),
  }),
  withPropsOnChange(['selectedIndexes'], ({ selectedIndexes, recipes: previousRecipes }) => {
    localStorage.setItem('selectedIndexes', JSON.stringify(selectedIndexes));

    const recipes = filter(previousRecipes, i => selectedIndexes[i.index])
    return {
      recipes,
      ingredients: chain(recipes).map('ingredient').uniq().sortBy().map(name => ({ name })).value()
    };
  }),
  withPropsOnChange(['selected', 'recipes'], ({ selected, recipes, saveKey }) => {
    localStorage.setItem(saveKey, JSON.stringify(selected));

    const list = chain(recipes)
      .sortBy('ingredient')
      .groupBy('key')
      .map((b, key) => {
        let missing = {};
        const first = b[0];

        each(b, ({ ingredient }) => {
          if (!selected[ingredient]) {
            missing[ingredient] = true;
          }
        });

        missing = keys(missing);

        return {
          key,
          name: first.name,
          badge: first.badge,
          page: first.page,
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
  withPropsOnChange(['search', 'filterIngredients', 'ingredients'], ({ search, ingredients, filterIngredients, selected, buyListKeyed }) => {
    let copy = ingredients;

    if (search) {
      search = search.toLowerCase();
      copy = filter(copy, i => includes(i.name.toLowerCase(), search));
    }
    if (filterIngredients !== null) {
      if (filterIngredients === '+') {
        copy = filter(copy, i => !!buyListKeyed[i.name]);
      } else {
        copy = filter(copy, i => (filterIngredients ? selected[i.name] : !selected[i.name]));
      }
    }

    return {
      ingredients: copy,
    }
  }),
  withPropsOnChange(['cocktailSearch', 'recipes'], ({ cocktailSearch, recipes }) => {
    const loweredCocktailSearch = cocktailSearch ? cocktailSearch.toLowerCase() : '';

    const copy = map(recipes, i => {
      const visible = !loweredCocktailSearch || includes(i.name.toLowerCase(), loweredCocktailSearch);
      return {...i, visible };
    });

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
