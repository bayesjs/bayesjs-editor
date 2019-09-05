import React from 'react';
import { mount } from 'enzyme';
import ContextMenuItems from './index';

describe('ContextMenuItems Portal', () => {
  const contextItemsDiv = global.document.createElement('div');
  const body = global.document.querySelector('body');
  const Child = () => <div>Child</div>;
  let component;
  let shouldUnmounted = true;

  contextItemsDiv.setAttribute('id', 'context-items');
  body.appendChild(contextItemsDiv);

  beforeEach(() => {
    component = mount(
      <ContextMenuItems>
        <Child />
      </ContextMenuItems>,
    );
  });

  afterEach(() => {
    if (shouldUnmounted) component.unmount();
    shouldUnmounted = true;
  });

  describe('DOM Lifecycle', () => {
    it('appends into HTML on mount', () => {
      expect(contextItemsDiv.hasChildNodes()).toBeTruthy();
    });

    it('removes from HTML on unmount', () => {
      shouldUnmounted = false;
      component.unmount();
      expect(contextItemsDiv.hasChildNodes()).toBeFalsy();
    });
  });

  describe('React Lifecycle', () => {
    it('appends the Child on mount', () => {
      expect(component.find(Child).exists()).toBeTruthy();
    });

    it('removes the Child on unmount', () => {
      shouldUnmounted = false;
      component.unmount();
      expect(component.find(Child).exists()).toBeFalsy();
    });
  });
});
