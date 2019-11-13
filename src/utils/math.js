import float from 'float';
import { NODE_CPT_PRECISION } from 'constants/node';

export const roundValue = value => float.round(value, NODE_CPT_PRECISION);
