import React from 'react';
import { shallow } from 'enzyme';
import Nodes from './component';

const defaultProps = {
  nodes: [{
    id: 'node-1',
    position: { x: 0, y: 0 },
    size: { width: 100, height: 100 },
  }, {
    id: 'node-2',
    position: { x: 0, y: 0 },
    size: { width: 100, height: 100 },
  }],
  onMouseDown: jest.fn(jest.fn),
  onDoubleClick: jest.fn(jest.fn),
  onStateDoubleClick: jest.fn(jest.fn),
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<Nodes {...compProps} />);
};

describe('Nodes Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });
});
