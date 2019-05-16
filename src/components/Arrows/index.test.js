import React from 'react';
import { shallow } from 'enzyme';
import Arrows from './component';

const defaultProps = {
  arrows: [{
    key: 'arrow-1',
    from: {
      x: 0,
      y: 0,
      type: 'bottom',
    },
    to: {
      x: 100,
      y: 100,
      type: 'top',
    },
    markEnd: true,
  }, {
    key: 'arrow-2',
    from: {
      x: 0,
      y: 0,
      type: 'bottom',
    },
    to: {
      x: 100,
      y: 100,
      type: 'top',
    },
    markEnd: true,
  }, {
    key: 'arrow-3',
    from: {
      x: 0,
      y: 0,
      type: 'bottom',
    },
    to: {
      x: 100,
      y: 100,
      type: 'top',
    },
    markEnd: true,
  }],
  getStrokeOpacity: () => 1,
  getMarkEndStyle: () => 'url(#triangle)',
  onMouseDown: jest.fn(),
  onMouseLeave: jest.fn(),
  onMouseOver: jest.fn(),
  keyFocus: '',
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<Arrows {...compProps} />);
};

describe('Arrows Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });
});
