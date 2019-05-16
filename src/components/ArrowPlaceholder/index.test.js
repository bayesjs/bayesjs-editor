import React from 'react';
import { shallow } from 'enzyme';
import ArrowPlaceholder from './index';

const defaultProps = {
  from: { x: 0, y: 0 },
  to: { x: 100, y: 100 },
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<ArrowPlaceholder {...compProps} />);
};

describe('ArrowPlaceholder Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });
});
