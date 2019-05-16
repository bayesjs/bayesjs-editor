import React from 'react';
import { shallow } from 'enzyme';
import NodeConnection from './component';

const defaultProps = {
  name: 'name',
  cx: 0,
  cy: 0,
  color: '#ddd',
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<NodeConnection {...compProps} />);
};

describe('NodeConnection Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });
});
