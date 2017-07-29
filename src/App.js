import React from 'react';
// eslint-disable-next-line
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
import fontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import deathAndCoRecipes from './etc/death_and_co_recipes.csv';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse, NavLink, NavbarBrand } from 'reactstrap';
import pdtRecipes from './etc/pdt_recipes.csv';
import { chain, map } from 'lodash';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import CocktailIndex from './CocktailIndex'
import { compose, withStateHandlers } from 'recompose';

const indexes = map([{
  name: 'PDT',
  link: '/pdt',
  recipes: pdtRecipes
}, {
  name: 'Death & Co',
  link: '/death_and_co',
  recipes: deathAndCoRecipes
}], i => ({...i, ingredients: chain(i.recipes).map('ingredient').uniq().sortBy().map(name => ({ name })).value() }));


const App = ({ toggle, isOpen, ...props }) => {
  const links = map(indexes, (i, idx) => (
    <Route path={i.link} key={i.name} children={({match}) => (
      <NavItem>
        <NavLink active={!!match} href={`#${i.link}`}>{i.name}</NavLink>
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
        <div className="container-fluid" style={{marginTop: 10, fontSize: '80%'}}>
          <Switch>
            {indexes.map(i => (
                <Route key={i.name} path={i.link} render={props => (
                  <CocktailIndex name={i.name} recipes={i.recipes} ingredients={i.ingredients} saveKey={`selected`} />
                )} />
            ))}
            <Route render={() => <Redirect to="/pdt" />}></Route>
          </Switch>
          <p className="text-muted mt-3 text-center">Thanks to /u/ThePaternalDrunk and /u/el_joker1 for the original index spreadsheets</p>
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
