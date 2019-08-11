import {
  compose,
  withProps,
  branch,
  renderNothing,
} from 'recompose';

const enhance = compose(
  branch(({ svg }) => !svg, renderNothing),
  withProps(({ node: { size, position } }) => ({
    fromPosition: {
      x: position.x + (size.width / 2),
      y: position.y + (size.height / 2),
    },
  })),
);

export default enhance;
