import ArrowPlaceholder from 'components/ArrowPlaceholder';
import React from 'react';
import SvgMousePosition from 'components/SvgMousePosition';
import { shallow } from 'enzyme';
import ArrowMovingPlaceholder from './component';

const svg = document.createElement('svg');
const shallowComponent = (props = {}) => shallow(<ArrowMovingPlaceholder {...props} />);

describe('ArrowMovingPlaceholder Component', () => {
  let eventsMap;
  let defaultProps;

  beforeEach(() => {
    eventsMap = {};
    svg.addEventListener = jest.fn((event, cb) => {
      eventsMap[event] = cb;
    });
    svg.removeEventListener = jest.fn();

    defaultProps = {
      nodes: [
        {
          id: 'node-1',
          states: [],
          parents: [],
          position: { x: 0, y: 0 },
          size: { width: 160, height: 100 },
        },
        {
          id: 'node-2',
          states: [],
          parents: [],
          position: { x: 200, y: 200 },
          size: { width: 160, height: 100 },
        },
      ],
      node: {
        id: 'node-1',
        states: [],
        parents: [],
        position: { x: 0, y: 0 },
        size: { width: 160, height: 100 },
      },
      fromPosition: { x: 50, y: 50 },
      svg,
      onSetPosition: jest.fn(),
    };
  });

  describe('Event Listeners', () => {
    describe('Check bind and unbind events', () => {
      it('"mousedown" event', () => {
        const component = shallowComponent(defaultProps);
        const componentInstance = component.instance();

        expect(svg.addEventListener)
          .toHaveBeenCalledWith('mousedown', componentInstance.handleSetPosition);

        component.unmount();

        expect(svg.removeEventListener)
          .toHaveBeenCalledWith('mousedown', componentInstance.handleSetPosition);
      });
    });

    describe('When "mousedown" event is triggered', () => {
      let onSetPosition;

      beforeEach(() => {
        onSetPosition = jest.fn();
      });

      describe('When "lastPosition" is inside a node', () => {
        it('calls "onSetPosition" prop', () => {
          const component = shallowComponent({ ...defaultProps, onSetPosition });
          const lastPosition = { x: 250, y: 250 };

          component.instance().lastPosition = lastPosition;
          eventsMap.mousedown();

          expect(onSetPosition).toHaveBeenCalledWith({
            position: lastPosition,
            node: {
              id: 'node-2',
              states: [],
              parents: [],
              position: { x: 200, y: 200 },
              size: { width: 160, height: 100 },
            },
          });
        });
      });

      describe('When "lastPosition" is not inside a node', () => {
        it('calls "onSetPosition" prop', () => {
          const component = shallowComponent({ ...defaultProps, onSetPosition });
          const lastPosition = { x: 999, y: 999 };

          component.instance().lastPosition = lastPosition;
          eventsMap.mousedown();

          expect(onSetPosition).toHaveBeenCalledWith({
            position: lastPosition,
            node: undefined,
          });
        });
      });

      describe('When there is no "lastPosition" value', () => {
        it('calls "onSetPosition" prop', () => {
          shallowComponent({ ...defaultProps, onSetPosition });
          eventsMap.mousedown();

          expect(onSetPosition).not.toBeCalled();
        });
      });
    });
  });

  describe('"SvgMousePosition" render prop', () => {
    const position = { x: 100, y: 50 };
    let component;

    beforeEach(() => {
      component = shallowComponent(defaultProps);
    });

    describe('When "onFirstMove" was not called', () => {
      it('returns null', () => {
        const wrapper = component.find(SvgMousePosition).renderProp('children')({ position });

        expect(wrapper.instance()).toBe(null);
      });
    });

    describe('When "onFirstMove" was called', () => {
      let wrapper;

      beforeEach(() => {
        component.find(SvgMousePosition).renderProp('onFirstMove')(position);
        wrapper = component.find(SvgMousePosition).renderProp('children')({ position, hasPosition: true });
      });

      it('returns "ArrowPlaceholder"', () => {
        expect(wrapper.type()).toBe(ArrowPlaceholder);
      });

      it('set "lastPosition"', () => {
        const componentInstance = component.instance();

        expect(componentInstance.lastPosition).toEqual(position);
      });
    });
  });
});
