import React from 'react';
import { shallow } from 'enzyme';
import NodeDivider from './component';

const defaultProps = {
  y: 5,
  width: 150,
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<NodeDivider {...compProps} />);
};

describe('NodeDivider Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });
});
