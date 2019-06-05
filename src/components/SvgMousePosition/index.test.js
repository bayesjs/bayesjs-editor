import React from 'react';
import { shallow } from 'enzyme';
import * as lodash from 'lodash';
import SvgMousePosition from './component';

const svg = document.createElement('svg');
const shallowComponent = (props = {}) => shallow(<SvgMousePosition {...props} />);

describe('SvgMousePosition Component', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      svg,
      children: jest.fn(() => <div />),
      onFirstMoveOnce: jest.fn(),
    };
  });

  describe('Lifecycle', () => {
    describe('componentDidMount', () => {
      const delay = 25;
      const svgRect = { top: 0, left: 0 };
      let component;

      beforeEach(() => {
        svg.getBoundingClientRect = jest.fn(() => svgRect);
        component = shallowComponent({ ...defaultProps, delay });
        component.instance().componentDidMount();
      });

      it('calls "getBoundingClientRect" from "svg"', () => {
        expect(svg.getBoundingClientRect).toBeCalled();
      });

      it('set "isComponentMounted" to "true"', () => {
        expect(component.instance().isComponentMounted).toBeTruthy();
      });

      it('calls "throttle" function with "delay" prop and "updatePosition" function', () => {
        expect(lodash.throttle).toBeCalledWith(
          component.instance().updatePosition,
          delay,
        );
      });

      it('creates "updatePositionWithThrottle" function', () => {
        expect(component.instance().updatePositionWithThrottle).toEqual(expect.any(Function));
      });
    });

    describe('componentDidMount', () => {
      let component;

      beforeEach(() => {
        component = shallowComponent(defaultProps);
        component.instance().componentWillUnmount();
      });

      it('set "isComponentMounted" to "false"', () => {
        expect(component.instance().isComponentMounted).toBeFalsy();
      });
    });
  });

  describe('Event Listeners', () => {
    describe('Check bind and unbind events', () => {
      beforeEach(() => {
        svg.addEventListener = jest.fn();
        svg.removeEventListener = jest.fn();
      });

      it('"mousemove" event', () => {
        const component = shallowComponent(defaultProps);
        const componentInstance = component.instance();

        expect(svg.addEventListener).toBeCalledWith(
          'mousemove',
          componentInstance.updatePositionWithThrottle,
        );

        return Promise.resolve().then(() => {
          component.unmount();
          expect(svg.removeEventListener).toBeCalledWith(
            'mousemove',
            componentInstance.updatePositionWithThrottle,
          );
        });
      });
    });

    describe('When "mousemove" event is triggered', () => {
      const map = {};

      beforeAll(() => {
        svg.addEventListener = jest.fn((event, cb) => {
          map[event] = cb;
        });
      });

      it('calls "updatePosition" method', () => {
        const component = shallowComponent(defaultProps);
        const componentInstance = component.instance();
        const spy = jest.spyOn(componentInstance, 'updatePosition');

        componentInstance.componentDidMount();
        map.mousemove({ clientX: 1, clientY: 1 });

        expect(spy).toBeCalled();
      });

      describe('When component is mounted', () => {
        const onFirstMoveOnce = jest.fn();
        let component;
        let componentInstance;

        beforeAll(() => {
          component = shallowComponent({ ...defaultProps, onFirstMoveOnce });
          componentInstance = component.instance();
        });

        it('updates state', () => {
          componentInstance.componentDidMount();
          componentInstance.isComponentMounted = true;
          jest.spyOn(componentInstance, 'setState');
          map.mousemove({ clientX: 1, clientY: 1 });

          expect(componentInstance.setState).toBeCalled();
        });

        it('calls "onFirstMoveOnce"', () => {
          expect(onFirstMoveOnce).toBeCalled();
        });
      });

      describe('When component is not mounted', () => {
        it('does not updates state', () => {
          const component = shallowComponent(defaultProps);
          const componentInstance = component.instance();

          componentInstance.componentDidMount();
          componentInstance.isComponentMounted = false;
          jest.spyOn(componentInstance, 'setState');
          map.mousemove({ clientX: 1, clientY: 1 });

          expect(componentInstance.setState).not.toBeCalled();
        });
      });
    });
  });
});
