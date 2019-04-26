import React from 'react';
import { shallow } from 'enzyme';
import Arrows from './component';

jest.mock('components/Arrow', () => {
  const Arrow = () => <div />;
  return Arrow;
});

const defaultProps = {
  arrows: [{
    key: 'arrow-1',
  }, {
    key: 'arrow-2',
  }, {
    key: 'arrow-3',
  }],
  getStrokeOpacity: () => 1,
  getMarkEndStyle: () => 'url(#triangle)',
  onMouseDown: jest.fn(),
  onMouseLeave: jest.fn(),
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
