import { shallow } from 'enzyme';
import React from 'react';
import ArrowsDefs from './index';

const shallowComponent = () =>
  shallow(<ArrowsDefs />);

describe('ArrowsDefs Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });
});
