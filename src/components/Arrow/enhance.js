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
    onMouseOver: ({ onMouseOver, id }) => () => onMouseOver(id),
    onMouseLeave: ({ onMouseLeave, id }) => () => onMouseLeave(id),
  }),
);

export default enhance;
