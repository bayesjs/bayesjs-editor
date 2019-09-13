import {
  withProps, pure, compose, withHandlers,
} from 'recompose';

import { makeArrowLine } from 'utils/arrows-positions';

const enhance = compose(
  pure,
  withProps(({
    from,
    to,
    markEnd,
    markEndStyle = 'url(#triangle)',
  }) => ({
    pathD: makeArrowLine(from, to),
    markerEnd: markEnd ? markEndStyle : '',
  })),
  withHandlers({
    onMouseOver: ({ onMouseOver, id }) => event => onMouseOver(event, id),
    onMouseLeave: ({ onMouseLeave, id }) => event => onMouseLeave(event, id),
  }),
);

export default enhance;
