import { shallow } from 'enzyme';
import React from 'react';
import Arrow from './component';

const defaultProps = {
  id: 'id',
  title: 'title',
  markerEnd: '',
  markEnd: false,
  from: { x: 0, y: 0 },
  to: { x: 100, y: 100 },
  onMouseDown: jest.fn(),
  pathD: '',
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<Arrow {...compProps} />);
};

describe('Arrow Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });
});
