import {
  reduce,
  prop,
  filter,
  equals,
  propEq,
  minBy,
  omit,
} from 'ramda';

const TYPE_LEFT = 'left';
const TYPE_RIGHT = 'right';
const TYPE_TOP = 'top';
const TYPE_BOTTOM = 'bottom';

const isTypeLeft = equals(TYPE_LEFT);
const isTypeRight = equals(TYPE_RIGHT);
const isTypeTop = equals(TYPE_TOP);
const isTypeBottom = equals(TYPE_BOTTOM);

const filterFromProp = filter(prop('from'));

const getArrows = nodes =>
  nodes.reduce((acc, node) => {
    const { parents } = node;
    const arrows = parents.map(parentId => ({
      from: nodes.find(propEq('id', parentId)),
      to: node,
    }));

    return [...acc, ...arrows];
  }, []);

const getNodeLinksPositionsTop = ({ width }, { x, y }) => ({
  x: x + width / 2,
  y,
  type: TYPE_TOP,
});

const getNodeLinksPositionsRigth = ({ width, height }, { x, y }) => ({
  x: x + width,
  y: y + height / 2,
  type: TYPE_RIGHT,
});

const getNodeLinksPositionsBottom = ({ width, height }, { x, y }) => ({
  x: x + width / 2,
  y: y + height,
  type: TYPE_BOTTOM,
});

const getNodeLinksPositionsLeft = ({ height }, { x, y }) => ({
  x,
  y: y + height / 2,
  type: TYPE_LEFT,
});

const getNodeLinksPositions = ({ size, position }) => [
  getNodeLinksPositionsTop(size, position),
  getNodeLinksPositionsRigth(size, position),
  getNodeLinksPositionsBottom(size, position),
  getNodeLinksPositionsLeft(size, position),
];

const getDistance = (p1, p2) =>
  Math.sqrt((Math.abs(p2.x - p1.x) ** 2) + (Math.abs(p2.y - p1.y) ** 2));

const getAllDistancesFromPoints = (points1, points2) =>
  points1.reduce((acc, from) => {
    const distances = points2.map(to => ({
      from,
      to,
      distance: getDistance(from, to),
    }));

    return [...acc, ...distances];
  }, []);

const getMinDistance = allDistances =>
  reduce(
    minBy(prop('distance')),
    { distance: Infinity },
    allDistances,
  );

const getNearestPoints = ({ from, to }) => {
  const allDistances = getAllDistancesFromPoints(
    getNodeLinksPositions(from),
    getNodeLinksPositions(to),
  );

  return omit(['distance'], getMinDistance(allDistances));
};

export const getArrowsPositions = nodes => filterFromProp(getArrows(nodes)).map((arrow) => {
  const { from, to } = arrow;

  return {
    ...getNearestPoints(arrow),
    key: `${from.id}-${to.id}`,
    parentId: from.id,
    childId: to.id,
    markEnd: true,
  };
});

const findNetworkById = networks => id => networks.find(propEq('id', id));

export const getArrowsPositionsForMSBN = (networks, linkagesByTwoNode) => {
  const getNetwork = findNetworkById(networks);

  return linkagesByTwoNode.map((linkage) => {
    const { networkId1, networkId2 } = linkage;
    const from = getNetwork(networkId1);
    const to = getNetwork(networkId2);
    const points = getNearestPoints({ from, to });

    return {
      ...points,
      key: `${networkId1}-${networkId2}`,
      markEnd: false,
      ...linkage,
    };
  });
};

const getXControlPoint = ({ type, x }, n) => {
  if (isTypeLeft(type)) return x - n;
  if (isTypeRight(type)) return x + n;
  return x;
};

const getYControlPoint = ({ type, y }, n) => {
  if (isTypeTop(type)) return y - n;
  if (isTypeBottom(type)) return y + n;
  return y;
};

const makeControlPoint = (point, n) => ({
  ...point,
  x: getXControlPoint(point, n),
  y: getYControlPoint(point, n),
});

export const makeArrowLine = (from, to, n = 50) => {
  const c1 = makeControlPoint(from, n);
  const c2 = makeControlPoint(to, n);

  return `M${from.x},${from.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${to.x},${
    to.y
  }`;
};
