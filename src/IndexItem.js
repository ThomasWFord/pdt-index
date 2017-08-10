import React from 'react';
import { compose, withHandlers } from 'recompose';
import { FormGroup, Label, Input } from 'reactstrap'

export const IndexItem = ({ item, selected, setSelectedIndex, ...props }) => {
  return (
    <FormGroup check>
      <Label check>
        <Input type="checkbox" onChange={setSelectedIndex} checked={selected} /> <span>{item.fullName || item.name} {item.badge}</span>
      </Label>
    </FormGroup>
  )
}

const enhance = compose(
  withHandlers({
    setSelectedIndex: ({ setSelectedIndex, item, }) => e => setSelectedIndex(item.name, e.target.checked)
  })
);

export default enhance(IndexItem);