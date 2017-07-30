import React from 'react';
// eslint-disable-next-line
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
import fontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import deathAndCoRecipes from './etc/death_and_co_recipes.csv';
import smugglersCoveRecipes from './etc/smugglers_cove_recipes.csv';
import vsAndFcRecipes from './etc/vs_and_fc_recipes.csv';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse, NavLink, NavbarBrand } from 'reactstrap';
import pdtRecipes from './etc/pdt_recipes.csv';
import { chain, map } from 'lodash';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import CocktailIndex from './CocktailIndex'
import { compose, withStateHandlers } from 'recompose';

const indexes = map([{
  name: 'PDT',
  link: '/pdt',
  recipes: pdtRecipes,
}, {
  name: 'Death & Co',
  link: '/death_and_co',
  recipes: deathAndCoRecipes,
}, {
  name: 'Smuggler\'s Cove',
  link: '/smugglers_cove',
  recipes: smugglersCoveRecipes,
}, {
  name: 'Vintage Spirits and Forgotten',
  linkName: 'VS & FC',
  link: '/vs_and_fc',
  recipes: vsAndFcRecipes,
}], i => ({...i, ingredients: chain(i.recipes).map('ingredient').uniq().sortBy().map(name => ({ name })).value() }));

const containerStyle = {marginTop: 10, fontSize: '80%'};

const App = ({ toggle, isOpen, ...props }) => {
  const links = map(indexes, (i, idx) => (
    <Route path={i.link} key={i.name} children={({match}) => (
      <NavItem>
        <NavLink active={!!match} href={`#${i.link}`}>{i.linkName || i.name}</NavLink>
      </NavItem>
    )} />
  ));

  return (
    <Router>
      <div>
        <Navbar color="faded" light toggleable>
          <NavbarToggler right onClick={toggle} />
          <NavbarBrand>Cocktail Index</NavbarBrand>
          <Collapse isOpen={isOpen} navbar>
            <Nav navbar>
              {links}
            </Nav>
          </Collapse>
        </Navbar>
        <div className="container-fluid " style={containerStyle}>
          <Switch>
            {indexes.map(i => (
                <Route key={i.name} path={i.link} render={props => (
                  <CocktailIndex name={i.name} recipes={i.recipes} ingredients={i.ingredients} saveKey={`selected`} />
                )} />
            ))}
            <Route render={() => <Redirect to="/pdt" />}></Route>
          </Switch>
          <p className="text-muted mt-3 text-center">Thanks to ThePaternalDrunk, el_joker1 & rebeldragonlol for the index spreadsheets</p>
        </div>
      </div>
    </Router>
  );
}

export const enhance = compose(
  withStateHandlers({ isOpen: false }, {
    toggle: ({ isOpen }) => () => ({ isOpen: !isOpen })
  })
);

export default enhance(App);
