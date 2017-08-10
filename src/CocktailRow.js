import React from 'react';
import { PopoverContent, Popover, PopoverTitle, Button as ReactstrapButton } from 'reactstrap';
import { withStateHandlers, compose, pure, withPropsOnChange, shouldUpdate } from 'recompose';
import MissingIngredient from './MissingIngredient';
import shortid from 'shortid';
import deepDiff from 'deep-diff';
import { pick } from 'lodash';

const popoverButtonStyle = {whiteSpace: 'normal', textAlign: 'left'};

const Button = pure(ReactstrapButton);

export const CocktailRow = ({ item, selected, onAddIngredient, toggle, isOpen, target, ...props }) => {
  return (
    <tr style={{display: item.visible ? 'table-row': 'none'}}>
      <td>
        <div>
          {isOpen && <Popover placement="right" isOpen={isOpen} toggle={toggle} target={target}>
            <PopoverTitle>{item.name}{!!item.page && ` (p${item.page})`}</PopoverTitle>
            <PopoverContent className="small">
              <ul className="list-unstyled">
              {item.raw.map(i => (
                <li key={i.ingredient}>
                  <span className={!selected[i.ingredient] ? 'text-danger' : ''}>{i.ingredient}</span><span className="text-info">{i.notes ? ` ${i.notes}` : ''}
                  {!!i.category && ` (${i.category})`}</span>
                </li>
              ))}
              </ul>
            </PopoverContent>
          </Popover>}
          <Button size="sm" color="link" style={popoverButtonStyle} onClick={toggle} id={target}>{item.name}</Button>

        </div>
      </td>
      <td>{item.badge}</td>
      <td>{item.numMissing}</td>
      <td>{item.missing.map((i, idx) => (
        <span key={i}>
          <MissingIngredient appendSeperator={item.missing.length > 1 && idx < item.missing.length - 1} onAddIngredient={onAddIngredient} ingredient={i} />
        </span>
      ))}</td>
    </tr>
  )
}

const enhance = compose(
  shouldUpdate(({ item, appendSeperator }, { item: nextItem, appendSeperator: nextAppendSeperator }) => {
    if (appendSeperator !== nextAppendSeperator) return true;

    const diff = deepDiff(pick(item, ['name', 'missing', 'visible']), pick(nextItem, ['name', 'missing', 'visible']));
    return !!diff;
  }),
  withPropsOnChange([''], () => ({ target: shortid() })),
  withStateHandlers({ isOpen: false }, {
    toggle: ({ isOpen }) => () => ({ isOpen: !isOpen }),
  }),
);

export default enhance(CocktailRow);
