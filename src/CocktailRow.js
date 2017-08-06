import React from 'react';
import { PopoverContent, Popover, PopoverTitle, Button as ReactstrapButton } from 'reactstrap';
import { withStateHandlers, compose, pure, withPropsOnChange, shouldUpdate } from 'recompose';
import MissingIngredient from './MissingIngredient';
import shortid from 'shortid';
import deepDiff from 'deep-diff';
import { pick } from 'lodash';

const popoverButtonStyle = {whiteSpace: 'normal', textAlign: 'left'};

const Button = pure(ReactstrapButton);

export const CocktailRow = ({ item, onAddIngredient, toggle, isOpen, target, ...props }) => {
  return (
    <tr>
      <td>
        <div>
          {isOpen && <Popover placement="right" isOpen={isOpen} toggle={toggle} target={target}>
            <PopoverTitle>{item.name}{!!item.page && ` (p${item.page})`}</PopoverTitle>
            <PopoverContent className="small">
              <ul className="list-unstyled">
              {item.raw.map(i => (
                <li key={i.ingredient}>
                  {i.ingredient}<span className="text-info">{i.notes ? ` ${i.notes}` : ''}
                  {!!i.category && ` (${i.category})`}</span>
                </li>
              ))}
              </ul>
            </PopoverContent>
          </Popover>}
          <Button size="sm" color="link" style={popoverButtonStyle} onClick={toggle} id={target}>{item.name}</Button>

        </div>
      </td>
      <td>{item.numMissing}</td>
      <td>{item.missing.map((i, idx) => (
        <span key={i}>
          {!!idx && '; '}<MissingIngredient onAddIngredient={onAddIngredient} ingredient={i} />
        </span>
      ))}</td>
    </tr>
  )
}

const enhance = compose(
  shouldUpdate(({ item }, { item: nextItem }) => {
    const diff = deepDiff(pick(item, ['name', 'missing']), pick(nextItem, ['name', 'missing']));
    return !!diff;
  }),
  withPropsOnChange([''], () => ({ target: shortid() })),
  withStateHandlers({ isOpen: false }, {
    toggle: ({ isOpen }) => () => ({ isOpen: !isOpen }),
  }),
);

export default enhance(CocktailRow);
