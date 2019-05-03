import React from 'react';
import { shallow } from 'enzyme';
import NodePlaceholder from './index';

const defaultProps = {
  x: 0,
  y: 5,
  width: 150,
  height: 100,
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<NodePlaceholder {...compProps} />);
};

describe('NodePlaceholder Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });
});
