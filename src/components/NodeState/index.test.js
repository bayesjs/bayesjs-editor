import React from 'react';
import { shallow } from 'enzyme';
import NodeState from './component';

const defaultProps = {
  state: 'state',
  onStateDoubleClick: jest.fn(),
  results: {},
  y: 5,
  height: 20,
  textX: 5,
  barX: 80,
  textWidth: 70,
  barWidth: 70,
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<NodeState {...compProps} />);
};

describe('NodeState Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });

  describe('Event Listeners', () => {
    describe('onStateDoubleClick', () => {
      const onStateDoubleClickInnerEvent = jest.fn();
      const onStateDoubleClick = jest.fn(() => onStateDoubleClickInnerEvent);
      const component = shallowComponent({ onStateDoubleClick });

      beforeAll(() => {
        component.find('NodeStateBar').simulate('doubleClick');
      });

      it('triggers "onStateDoubleClick" render component', () => {
        expect(onStateDoubleClick).toBeCalledWith('state');
      });

      it('triggers "onStateDoubleClickInnerEvent" on clicked NodeStateBar', () => {
        expect(onStateDoubleClickInnerEvent).toBeCalled();
      });
    });
  });
});
