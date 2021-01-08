import { NODE_CPT_PRECISION } from '@constants/node';
import float from 'float';

export const roundValue = value => float.round(value, NODE_CPT_PRECISION);
