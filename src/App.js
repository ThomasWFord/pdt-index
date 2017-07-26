import React from 'react';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import fontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import { FormGroup, Label, Input, Card, CardBlock, CardTitle, CardText, ButtonGroup, Button, InputGroup, InputGroupAddon,
  CardSubtitle, Table } from 'reactstrap'
import './App.css';
import { compose, defaultProps, withStateHandlers, withPropsOnChange, withHandlers } from 'recompose';
import ingredients from './etc/ingredients.csv';
import recipes from './etc/recipes.csv';
import update from 'immutability-helper';
import { chain, sortBy, each, filter, includes } from 'lodash';


const LocalCard = ({ title, subtitle, children, ...props }) => {
  return (
    <Card {...props}>
      <CardBlock>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardSubtitle className="text-muted mb-3">{subtitle}</CardSubtitle>}
        <CardText tag="div">{children}</CardText>
      </CardBlock>
    </Card>
  );
}

const App = ({ ingredients, dirty, topFiveYield, onSaveChanges, recipes, have, filterIngredients, onSelectAllChange, setFilterIngredients, buyList, setSelected, search, setSearch, selected, ...props }) => {
  return (
    <div className="container-fluid" style={{marginTop: 10, fontSize: '80%'}}>
      <h1 className="display-4 text-center mb-2">PDT Index</h1>
      <div className="row">
        <div className="col-md-3 col-lg-3 col-xl-2">
          <LocalCard title="Ingredients">
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
          </LocalCard>
        </div>
        <div className="col">
          <LocalCard title="Cocktails" subtitle={`You can make ${have} out of ${recipes.length} cocktails`}>
            <Table size="sm" striped>
              <thead>
              <tr>
                <th>Name</th>
                <th colSpan="2">Missing</th>
                <th>You have</th>

              </tr>
              </thead>
              <tbody>
              {recipes.map(i => (
                <tr key={i.name}>
                  <td style={{whiteSpace: 'noWrap'}}>{i.name}</td>
                  <td>{i.numMissing}</td>
                  <td>{i.missing.join(', ')}</td>
                  <td>{i.have.join(', ')}</td>
                </tr>
              ))}
              </tbody>
            </Table>
          </LocalCard>
        </div>
        <div className="col">
          <LocalCard title="Buy List" subtitle={`Purchase the top 5 for an additional ${topFiveYield} cocktails`}>
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
                  <td style={{whiteSpace: 'noWrap'}}>{i.ingredient}</td>
                  <td>{i.num}</td>
                  <td>{i.cocktails.join(', ')}</td>
                </tr>
              ))}
              </tbody>
            </Table>
          </LocalCard>
        </div>
      </div>
      <p className="text-muted mt-3 text-center">Thanks to /u/ThePaternalDrunk from Reddit for the original PDT Index spreadsheet</p>
    </div>
  );
}

const enhance = compose(
  defaultProps({ ingredients, recipes }),
  withStateHandlers(props => ({
    selected: JSON.parse(localStorage.getItem('selected') || '{}'),
    search: '',
    filterIngredients: null
  }), {
    setSelected: ({ selected }) => (ingredient, value) => ({
      selected: update(selected, { [ingredient]: { $set: value } }),
      dirty: true,
    }),
    setBulkSelected: () => (selected) => ({ selected, dirty: true }),
    setSearch: () => (search) => ({ search }),
    setFilterIngredients: () => (filterIngredients) => ({ filterIngredients }),
    onSaveChanges: ({ selected }) => () => {
      localStorage.setItem('selected', JSON.stringify(selected));
      return { dirty: false };
    }
  }),
  withPropsOnChange(['selected'], ({ selected, recipes }) => {
    const list = chain(recipes)
      .groupBy('name')
      .map((b, name) => {
        const missing = [];
        const have = [];

        each(b, ({ ingredient }) => {
          if (!selected[ingredient]) {
            missing.push(ingredient);
          } else {
            have.push(ingredient);
          }
        });

        return {
          name: name,
          numMissing: missing.length,
          missing: sortBy(missing),
          have: sortBy(have),
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

export default enhance(App);
