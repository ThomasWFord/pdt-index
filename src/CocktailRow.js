import React from 'react';
import { PopoverContent, Popover, PopoverTitle, Button } from 'reactstrap';
import { withStateHandlers, compose } from 'recompose';

export const CocktailRow = ({ item, toggle, isOpen, ...props }) => {
  return (
    <tr>
      <td>
        <div>
          {isOpen && <Popover placement="right" isOpen={isOpen} toggle={toggle} target={`cocktail_${item.index}`}>
            <PopoverTitle>{item.name}{!!item.page && ` (p${item.page})`}</PopoverTitle>
            <PopoverContent className="small">
              <ul className="list-unstyled">
              {item.raw.map(i => (
                <li>
                  {i.ingredient}<span className="text-info">{i.notes ? ` ${i.notes}` : ''}
                  {!!i.category && ` (${i.category})`}</span>
                </li>
              ))}
              </ul>
            </PopoverContent>
          </Popover>}
          <Button size="sm" color="link" style={{whiteSpace: 'normal', textAlign: 'left'}} onClick={toggle} id={`cocktail_${item.index}`}>{item.name}</Button>
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
