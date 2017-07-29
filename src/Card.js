import React from 'react';
import { Card, CardBlock, CardTitle, CardText, CardSubtitle, CardHeader, Collapse } from 'reactstrap';
import { compose, withStateHandlers } from 'recompose';
import classNames from 'classnames';

export const LocalCard = ({ title, subtitle, isOpen, toggleKey, toggle, header, children, ...props }) => {
  const toggleClass = classNames('fa text-muted pull-right', {'fa-chevron-up': isOpen, 'fa-chevron-down': !isOpen});
  return (
    <Card {...props}>
      {!!header && <CardHeader tag="h6" onClick={toggle}>{header} <span className={toggleClass} /></CardHeader>}
      <Collapse isOpen={isOpen}>
        <CardBlock>
          {!!title && <CardTitle>{title}</CardTitle>}
          {!!subtitle && <CardSubtitle className="text-muted mb-3">{subtitle}</CardSubtitle>}
          <CardText tag="div">{children}</CardText>
        </CardBlock>
      </Collapse>
    </Card>
  );
}

export const enhance = compose(
  withStateHandlers(props => {
    const fromStorage = localStorage.getItem(props.toggleKey);
    return { isOpen: fromStorage === null || fromStorage === 'true' };
  }, {
    toggle: ({ isOpen }, { toggleKey }) => () => {
      localStorage.setItem(toggleKey, !isOpen);
      return { isOpen: !isOpen };
    }
  }),
);

export default enhance(LocalCard);