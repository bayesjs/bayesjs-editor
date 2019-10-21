import { sort, isEmpty } from 'ramda';

export const COLORS = [
  '#D84315',
  '#BF360C',
  '#FBC02D',
  '#F9A825',
  '#F57F17',
  '#FFA000',
  '#FF8F00',
  '#FF6F00',
  '#F57C00',
  '#EF6C00',
  '#E65100',
  '#388E3C',
  '#2E7D32',
  '#689F38',
  '#558B2F',
  '#AFB42B',
  '#0288D1',
  '#0097A7',
  '#00838F',
  '#1976D2',
  '#1565C0',
  '#C2185B',
];

const shuffle = sort(() => Math.random() - 0.5);

const createRandomColorBuilder = () => {
  let list = [];
  return () => {
    if (isEmpty(list)) {
      list = shuffle(COLORS);
    }
    return list.shift();
  };
};

export const getRandomColor = createRandomColorBuilder();
