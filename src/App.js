import React from 'react';
// eslint-disable-next-line
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
import fontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import deathAndCoRecipes from './etc/death_and_co_recipes.csv';
import smugglersCoveRecipes from './etc/smugglers_cove_recipes.csv';
import vsAndFcRecipes from './etc/vs_and_fc_recipes.csv';
import pdtRecipes from './etc/pdt_recipes.csv';
import { Navbar, NavbarBrand, Badge } from 'reactstrap';
import { chain, map } from 'lodash';
import CocktailIndex from './CocktailIndex';
import { compose, withStateHandlers } from 'recompose';
import ReactGA from 'react-ga';
import { startsWith } from 'lodash';


ReactGA.initialize('UA-103648191-1');

const colours = ['primary', 'success', 'info', 'warning', 'default', 'danger', '#109618', '#DD4477', '#DC3912'];

const indexes = chain([{
  name: 'PDT',
  recipes: pdtRecipes,
}, {
  name: 'D&C',
  fullName: 'Death & Co',
  recipes: deathAndCoRecipes,
}, {
  name: 'SC',
  fullName: `Smuggler's Cove`,
  recipes: smugglersCoveRecipes,
}, {
  name: 'VS',
  fullName: 'Vintage Spirits & Forgotten Cocktails',
  recipes: vsAndFcRecipes,
}, {
  name: 'DR',
  fullName: 'Dead Rabbit Drinks Manual',
  recipes: require('./etc/dead_rabbits_drinks_manual.csv')
}, {
  name: 'LI',
  fullName: 'Liquid Intelligence',
  recipes: require('./etc/liquid_intelligence.csv')
}, {
  name: 'DB',
  fullName: 'The Drunken Botanist',
  recipes: require('./etc/the_drunken_botanist.csv')
}, {
  name: 'CC',
  fullName: 'The Canon Cocktail Book',
  recipes: require('./etc/canon_cocktail_book.csv')
},{
  name: 'SE',
  fullName: 'Speakeasy: The Employees Only Guide',
  recipes: require('./etc/speakeasy.csv')
}]).map((i, idx) => ({
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
        <p className="text-muted mt-3 text-center">Thanks to ThePaternalDrunk, el_joker1 & rebeldragonlol for the index spreadsheets</p>
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
