import React from 'react';
import { shallow } from 'enzyme';
import Node from './index';

const defaultProps = {
  id: 'id',
  states: ['S1', 'S2'],
  isSelected: false,
  onMouseDown: jest.fn(),
  onStateDoubleClick: jest.fn(),
  position: { x: 0, y: 0 },
  size: { width: 160, height: 100 },
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<Node {...compProps} />);
};

describe('Node Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });
});
