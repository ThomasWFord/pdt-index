import React from 'react';
import { Popover, PopoverTitle, Button, PopoverContent } from 'reactstrap';
import { withStateHandlers, compose, withPropsOnChange, defaultProps, withHandlers, onlyUpdateForKeys } from 'recompose';
import shortid from 'shortid';
import { noop } from 'lodash';

const popoverButtonStyle = {whiteSpace: 'normal', textAlign: 'left', paddingLeft: 0, paddingRight: 0};

export const MissingIngredient = ({ ingredient, onAddIngredient, isOpen, toggle, target, linkStyle, ...props }) => {
  return (
    <span>
      {isOpen && <Popover isOpen={isOpen} toggle={toggle} target={target}>
        <PopoverTitle>{ingredient}</PopoverTitle>
        <PopoverContent className="small">
          <Button onClick={onAddIngredient} size="sm" color="success" block><span className="fa fa-plus" /> Add to Ingredients</Button>
        </PopoverContent>
      </Popover>}
      <Button size="sm" color="link" style={linkStyle} onClick={toggle} id={target}>{ingredient}</Button>
    </span>
  )
}

export const enhance = compose(
  onlyUpdateForKeys(['ingredient']),
  defaultProps({ linkStyle: popoverButtonStyle }),
  withPropsOnChange([''], () => ({ target: shortid() })),
  withStateHandlers({ isOpen: false}, {
    toggle: ({ isOpen }) => () => ({ isOpen: !isOpen }),
  }),
  withHandlers({
    onAddIngredient: ({ onAddIngredient = noop, ingredient }) => () => {
      return onAddIngredient(ingredient)
    },
  }),
)

export default enhance(MissingIngredient);