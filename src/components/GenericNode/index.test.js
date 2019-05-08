import React from 'react';
import { shallow } from 'enzyme';
import GenericNode from './component';

const defaultProps = {
  id: 'id',
  name: 'name',
  position: { x: 0, y: 0 },
  size: { height: 100, width: 100 },
  isSelected: false,
  onMouseDown: jest.fn(),
  onDoubleClick: jest.fn(),
  style: {},
  textX: 5,
  textY: 0,
  textHeight: 20,
  textWidth: 150,
  descriptionX: 5,
  descriptionY: 20,
  descriptionHeight: 20,
  descriptionWidth: 150,
  showDescription: false,
};

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<GenericNode {...compProps} />);
};

describe('GenericNode Component', () => {
  it('matches snapshot with description', () => {
    const component = shallowComponent({
      showDescription: true,
      descritpion: 'descritpion',
    });

    expect(component).toMatchSnapshot();
  });

  it('matches snapshot without description', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });

  describe('Event Listeners', () => {
    describe('onMouseDown', () => {
      const onMouseDown = jest.fn();
      const component = shallowComponent({ onMouseDown });

      beforeEach(() => {
        component.simulate('mouseDown');
      });

      it('triggers "onMouseDown" on mouseDown event', () => {
        expect(onMouseDown).toBeCalled();
      });
    });

    describe('onDoubleClick', () => {
      const onDoubleClick = jest.fn();
      const component = shallowComponent({ onDoubleClick });

      beforeEach(() => {
        component.simulate('doubleClick');
      });

      it('triggers "onDoubleClick" on mouseDown event', () => {
        expect(onDoubleClick).toBeCalled();
      });
    });
  });
});
