import React from 'react';
import { shallow } from 'enzyme';
import NodeMovingPlaceholder from './index';

const svg = document.createElement('svg');

const defaultProps = {
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

const shallowComponent = (props = {}) => {
  const compProps = { ...defaultProps, ...props };

  return shallow(<NodeMovingPlaceholder {...compProps} />);
};

describe('NodeMovingPlaceholder Component', () => {
  describe('Event Listeners', () => {
    describe('Check bind and unbind events', () => {
      beforeEach(() => {
        svg.addEventListener = jest.fn();
        svg.removeEventListener = jest.fn();
      });

      it('"mouseup" and "mouseleave" events', () => {
        const component = shallowComponent();
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
      const map = {};
      const onCancel = jest.fn();

      beforeAll(() => {
        svg.addEventListener = jest.fn((event, cb) => {
          map[event] = cb;
        });
      });

      it('calls "onCancel" prop', () => {
        shallowComponent({ onCancel });
        map.mouseleave();

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
          const component = shallowComponent({ onSetPosition });
          component.instance().lastNodePosition = { x: 1, y: 1 };
          map.mouseup();

          expect(onSetPosition).toBeCalled();
        });
      });

      describe('When there is no "lastNodePosition" value', () => {
        it('calls "onSetPosition" prop', () => {
          shallowComponent({ onSetPosition });
          map.mouseup();

          expect(onSetPosition).not.toBeCalled();
        });
      });
    });
  });

  describe('Methods', () => {
    let component;

    beforeEach(() => {
      component = shallowComponent();
    });

    describe('setMousePositionInNode', () => {
      const svgMousePosition = { x: 100, y: 50 };

      it('set "mousePositionInNode"', () => {
        const { setMousePositionInNode } = component.instance();

        expect(component.instance().mousePositionInNode).toBe(undefined);
        setMousePositionInNode(svgMousePosition);
        expect(component.instance().mousePositionInNode).toEqual(expect.any(Object));
      });
    });

    describe('renderNodePlaceholder', () => {
      const position = { x: 100, y: 50 };

      describe('When there is no "mousePositionInNode"', () => {
        it('returns null', () => {
          const { renderNodePlaceholder } = component.instance();

          expect(renderNodePlaceholder({ position })).toBe(null);
        });
      });

      describe('When there is "mousePositionInNode"', () => {
        it('returns a component', () => {
          const componentInstance = component.instance();
          const { renderNodePlaceholder } = componentInstance;
          componentInstance.mousePositionInNode = position;

          expect(renderNodePlaceholder({ position })).toEqual(expect.any(Object));
        });

        it('set "lastNodePosition"', () => {
          const componentInstance = component.instance();
          const { renderNodePlaceholder } = componentInstance;
          componentInstance.mousePositionInNode = position;

          expect(componentInstance.lastNodePosition).toBe(undefined);
          renderNodePlaceholder({ position });
          expect(componentInstance.lastNodePosition).toEqual(expect.any(Object));
        });
      });
    });
  });
});
