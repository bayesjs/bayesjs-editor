import React from 'react';
import { shallow } from 'enzyme';
import NodeStateBar from './component';

const defaultProps = {
  barWidth: 70,
  fillColor: '#ddd',
  percentText: '50 %',
  x: 5,
  textX: 5,
  textY: 0,
  barX: 80,
  barY: 5,
  height: 20,
  width: 70,
  onDoubleClick: jest.fn(),
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<NodeStateBar {...compProps} />);
};

describe('NodeStateBar Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });

  describe('Event Listeners', () => {
    describe('onStateDoubleClick', () => {
      const onDoubleClick = jest.fn();
      const component = shallowComponent({ onDoubleClick });

      beforeAll(() => {
        component.find('rect').last().simulate('doubleClick');
      });

      it('triggers "onDoubleClick" on doubleClick', () => {
        expect(onDoubleClick).toBeCalled();
      });
    });
  });
});
