import React from 'react';
import { shallow } from 'enzyme';
import SvgText from './component';

const defaultProps = {
  text: 'text',
  x: 5,
  y: 5,
  height: 20,
  width: 160,
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<SvgText {...compProps} />);
};

describe('SvgText Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });
});
