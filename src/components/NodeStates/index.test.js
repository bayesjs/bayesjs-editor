import React from 'react';
import { shallow } from 'enzyme';
import NodeStates from './component';

const defaultProps = {
  states: ['state-1', 'state-2'],
  id: 'node-id',
  stateHeight: 20,
  stateWidth: 160,
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<NodeStates {...compProps} />);
};

describe('NodeStates Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });
});
