import React from 'react';
import { shallow } from 'enzyme';
import SvgMousePosition from 'components/SvgMousePosition';
import NodePlaceholder from 'components/NodePlaceholder';
import NodeMovingPlaceholder from './index';

const svg = document.createElement('svg');
const shallowComponent = (props = {}) => shallow(<NodeMovingPlaceholder {...props} />);

describe('NodeMovingPlaceholder Component', () => {
  let eventsMap;
  let defaultProps;

  beforeEach(() => {
    eventsMap = {};
    svg.addEventListener = jest.fn((event, cb) => {
      eventsMap[event] = cb;
    });
    svg.removeEventListener = jest.fn();

    defaultProps = {
      node: {
        id: 'node-id',
        states: [],
        parents: [],
        position: { x: 0, y: 0 },
        size: { width: 160, height: 100 },
      },
      svg,
      onSetPosition: jest.fn(),
      onCancel: jest.fn(),
    };
  });

  describe('Event Listeners', () => {
    describe('Check bind and unbind events', () => {
      it('"mouseup" and "mouseleave" events', () => {
        const component = shallowComponent(defaultProps);
        const componentInstance = component.instance();

        expect(svg.addEventListener.mock.calls).toEqual([
          ['mouseup', componentInstance.handleSetPosition],
          ['mouseleave', componentInstance.handleCancel],
        ]);

        return Promise.resolve().then(() => {
          component.unmount();
          expect(svg.removeEventListener.mock.calls).toEqual([
            ['mouseup', componentInstance.handleSetPosition],
            ['mouseleave', componentInstance.handleCancel],
          ]);
        });
      });
    });

    describe('When "mouseleave" event is triggered', () => {
      const onCancel = jest.fn();

      it('calls "onCancel" prop', () => {
        shallowComponent({ ...defaultProps, onCancel });
        eventsMap.mouseleave();

        expect(onCancel).toBeCalled();
      });
    });

    describe('When "mouseup" event is triggered', () => {
      let onSetPosition;
      let map;

      beforeEach(() => {
        map = {};
        onSetPosition = jest.fn();
        svg.addEventListener = jest.fn((event, cb) => {
          map[event] = cb;
        });
      });

      describe('When there is "lastNodePosition" value', () => {
        it('calls "onSetPosition" prop', () => {
          const component = shallowComponent({ ...defaultProps, onSetPosition });
          component.instance().lastNodePosition = { x: 1, y: 1 };
          map.mouseup();

          expect(onSetPosition).toBeCalled();
        });
      });

      describe('When there is no "lastNodePosition" value', () => {
        it('calls "onSetPosition" prop', () => {
          shallowComponent({ ...defaultProps, onSetPosition });
          map.mouseup();

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
        wrapper = component.find(SvgMousePosition).renderProp('children')({ position });
      });

      it('returns "NodePlaceholder"', () => {
        expect(wrapper.type()).toBe(NodePlaceholder);
      });

      it('set "lastNodePosition"', () => {
        const componentInstance = component.instance();

        expect(componentInstance.lastNodePosition).toEqual({ x: 0, y: 0 });
      });
    });
  });
});
