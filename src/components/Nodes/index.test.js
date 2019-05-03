import React from 'react';
import { shallow } from 'enzyme';
import Nodes from './component';

const defaultProps = {
  nodes: [{}, {}],
  onMouseDown: jest.fn(),
  onDoubleClick: jest.fn(),
  onStateDoubleClick: jest.fn(),
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
