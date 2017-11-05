import React from 'react';
// eslint-disable-next-line
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
import fontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import { Navbar, NavbarBrand, Badge } from 'reactstrap';
import { chain, map, each, includes } from 'lodash';
import CocktailIndex from './CocktailIndex';
import { compose, withStateHandlers } from 'recompose';
import ReactGA from 'react-ga';
import { startsWith } from 'lodash';
import recipesSource from './etc/recipeNameToIngredientIds.json';
import ingredientsSource from './etc/ingredientIdToIngredients.json';

const mapping = chain({
  "se": "Speakeasy: The Employees Only Guide",
  "cc": "The Canon Cocktail Book",
  "pdt": "PDT",
  "dr": "Dead Rabbit Drinks Manual",
  "li": "Liquid Intelligence",
  "dnc": "Death & Co",
  "vs": "Vintage Spirits & Forgotten Cocktails",
  "db": "The Drunken Botanist",
  "sc": `Smuggler's Cove`
})
  .mapValues((fullName, name) => ({
    name: name.toUpperCase(),
    fullName,
    recipes: []
  }))
  .tap((mapping) => {
    each(recipesSource, ([ingredients], key) => {
      const [name, source, page] = key.split('__');
      const { recipes } = mapping[source];

      recipes.push(...map(ingredients, i => {
        const { ingredient, type, name: notes } = ingredientsSource[i];

        return {
          ingredient: (includes(ingredient, type) || type === 'Other') ? ingredient : `${ingredient} (${type})`,
          name,
          notes,
          page,
        }
      }));
    });
  })
  .values()
  .value();

ReactGA.initialize('UA-103648191-1');


const colours = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark', 'custom-1'];

const indexes = chain(mapping).map((i, idx) => ({
  ...i,
  badge: <Badge color={colours[idx]} style={{width: 25, backgroundColor: startsWith(colours[idx], '#') ? colours[idx] : null }}><small>{i.name}</small></Badge>
})).value();

const recipes = chain(indexes)
  .map(({ name: index, recipes, badge }, idx) => map(recipes, ({ name, ...i }) => ({
    ...i,
    name: `${name}`,
    index,
    badge,
    key: `${index}${name}`
  })))
  .flatten()
  .value();

const containerStyle = {marginTop: 10, fontSize: '80%'};

const logPageView = (location) => {
  const { pathname, hash } = location;
  const page = `${pathname}${hash}`;
  ReactGA.set({ page });
  ReactGA.pageview(page);
}

logPageView(window.location)


const App = ({ toggle, isOpen, ...props }) => {
  return (
    <div>
      <Navbar color="faded" light>
        <NavbarBrand>Cocktail Index</NavbarBrand>
      </Navbar>
      <div className="container-fluid " style={containerStyle}>
        <CocktailIndex indexes={indexes} recipes={recipes} saveKey={`selected`} />
        <p className="text-muted mt-3 text-center">Thanks to ThePaternalDrunk, el_joker1, openequalsheavier & rebeldragonlol for the index spreadsheets</p>
      </div>
    </div>
  );
}

export const enhance = compose(
  withStateHandlers({ isOpen: false }, {
    toggle: ({ isOpen }) => () => ({ isOpen: !isOpen })
  })
);

export default enhance(App);
