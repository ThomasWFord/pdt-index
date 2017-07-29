import React from 'react';
import { Card, CardBlock, CardTitle, CardText, CardSubtitle } from 'reactstrap'

export const LocalCard = ({ title, subtitle, children, ...props }) => {
  return (
    <Card {...props}>
      <CardBlock>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardSubtitle className="text-muted mb-3">{subtitle}</CardSubtitle>}
        <CardText tag="div">{children}</CardText>
      </CardBlock>
    </Card>
  );
}

export default LocalCard;