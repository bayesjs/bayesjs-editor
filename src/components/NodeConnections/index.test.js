import React from 'react';
import { shallow } from 'enzyme';
import NodeConnections from './component';

const defaultProps = {
  connections: [{ networkName: 'network1' }, { networkName: 'network2' }],
  dividerY: 61,
  textX: 5,
  textY: 61,
  size: { height: 100, width: 160 },
  circlesY: 71,
  textHeight: 20,
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<NodeConnections {...compProps} />);
};

describe('NodeConnections Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });
});
