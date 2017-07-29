import React from 'react';
import { PopoverContent, Popover, PopoverTitle, Button } from 'reactstrap';
import { withStateHandlers, compose } from 'recompose';

export const CocktailRow = ({ item, toggle, isOpen, ...props }) => {
  return (
    <tr>
      <td>
        <div>
          <Popover placement="right" isOpen={isOpen} toggle={toggle} target={`cocktail_${item.index}`}>
            <PopoverTitle>{item.name}{!!item.page && ` (page ${item.page})`}</PopoverTitle>
            <PopoverContent className="small">
              {item.raw.map(i => <div key={i.ingredient}>{i.ingredient}{i.notes ? ` - ${i.notes}` : ''}</div>)}
            </PopoverContent>
          </Popover>
          <Button size="sm" color="link" onClick={toggle} id={`cocktail_${item.index}`}>{item.name}</Button>
        </div>
      </td>
      <td>{item.numMissing}</td>
      <td>{item.missing.join('; ')}</td>
    </tr>
  )
}

const enhance = compose(
  withStateHandlers({ isOpen: false }, {
    toggle: ({ isOpen }) => () => ({ isOpen: !isOpen }),
  }),
);

export default enhance(CocktailRow);
