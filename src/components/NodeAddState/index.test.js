import * as eventUtils from '@utils/event';

import { fireEvent, render } from '@testing-library/react';

import React from 'react';
import { getComponentTestId } from '@utils/test-utils';
import NodeAddState from './index';

const renderComponent = props =>
  render(
    <NodeAddState {...props} />,
  );

describe('NodeAddState Component', () => {
  const defaultProps = {
    onAddState: jest.fn(() => true),
  };
  let component;

  beforeEach(() => {
    defaultProps.onAddState.mockClear();
    component = renderComponent(defaultProps);
  });

  it('matches snapshot', () => {
    expect(component.container.firstChild).toMatchSnapshot();
  });

  describe('When keyup in input', () => {
    const { isEnterKey } = eventUtils;

    describe('and is "enter" key', () => {
      beforeEach(() => {
        const { getByPlaceholderText } = component;
        const input = getByPlaceholderText('Novo estado');

        eventUtils.isEnterKey = () => true;
        fireEvent.change(input, { target: { value: 'new state' } });
        fireEvent.keyUp(input);
      });

      afterAll(() => {
        eventUtils.isEnterKey = isEnterKey;
      });

      it('calls onAddState function', () => {
        expect(defaultProps.onAddState).toBeCalled();
      });
    });

    describe('and is not "enter" key', () => {
      beforeEach(() => {
        const { getByPlaceholderText } = component;
        const input = getByPlaceholderText('Novo estado');

        eventUtils.isEnterKey = () => false;
        fireEvent.change(input, { target: { value: 'new state' } });
        fireEvent.keyUp(input);
      });

      afterAll(() => {
        eventUtils.isEnterKey = isEnterKey;
      });

      it('does not call onAddState function', () => {
        expect(defaultProps.onAddState).not.toBeCalled();
      });
    });
  });

  describe('When clicked in add state button', () => {
    describe('and has a valid state', () => {
      const newState = 'new state';

      beforeEach(() => {
        const { getByPlaceholderText, getByTestId } = component;
        const input = getByPlaceholderText('Novo estado');
        const addButton = getByTestId(getComponentTestId('Button', 'Adicionar Estado'));

        fireEvent.change(input, { target: { value: newState } });
        fireEvent.click(addButton);
      });

      it('calls onAddState function', () => {
        expect(defaultProps.onAddState).toBeCalledWith(newState);
      });
    });

    describe('and has a invalid state', () => {
      const newState = '';

      beforeEach(() => {
        const { getByPlaceholderText, getByTestId } = component;
        const input = getByPlaceholderText('Novo estado');
        const addButton = getByTestId(getComponentTestId('Button', 'Adicionar Estado'));

        fireEvent.change(input, { target: { value: newState } });
        fireEvent.click(addButton);
      });

      it('calls onAddState function', () => {
        expect(defaultProps.onAddState).not.toBeCalled();
      });
    });
  });
});
