import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import * as nodeValidations from 'validations/node';
import { getComponentTestId } from 'utils/test-utils';
import EditNodeCptTableRow from './index';

const renderComponent = props =>
  render(
    <EditNodeCptTableRow {...props} />,
  );

describe('EditNodeCptTableRow Component', () => {
  let component;
  const defaultProps = {
    cptObject: {
      True: 0.5,
      False: 0.5,
    },
    onKeyUp: jest.fn(),
    onChange: jest.fn(),
  };

  beforeEach(() => {
    defaultProps.onKeyUp.mockClear();
    defaultProps.onChange.mockClear();
  });

  describe('When is valid', () => {
    beforeEach(() => {
      component = renderComponent(defaultProps);
    });

    it('matches snapshot', () => {
      expect(component.container.firstChild).toMatchSnapshot();
    });
  });

  describe('When is invalid', () => {
    const { isNodeCptValid } = nodeValidations;

    beforeEach(() => {
      nodeValidations.isNodeCptValid = () => false;
      component = renderComponent(defaultProps);
    });

    afterAll(() => {
      nodeValidations.isNodeCptValid = isNodeCptValid;
    });

    it('matches snapshot', () => {
      expect(component.container.firstChild).toMatchSnapshot();
    });
  });

  describe('When cpt changes', () => {
    describe('When CPT has one states', () => {
      beforeEach(() => {
        component = renderComponent({
          ...defaultProps,
          cptObject: {
            State: 1,
          },
        });
      });

      it('updates the state', () => {
        const { getByTestId } = component;
        const inputCptState = getByTestId(getComponentTestId('InputCpt', 'State'));

        fireEvent.change(inputCptState, { target: { value: 0.8 } });

        expect(defaultProps.onChange).toHaveBeenCalledWith({ State: 0.8 });
      });
    });

    describe('When CPT has two states', () => {
      beforeEach(() => {
        component = renderComponent(defaultProps);
      });

      it('updates the two states', () => {
        const { getByTestId } = component;
        const inputCptTrueState = getByTestId(getComponentTestId('InputCpt', 'True'));

        fireEvent.change(inputCptTrueState, { target: { value: 0.8 } });

        expect(defaultProps.onChange).toHaveBeenCalledWith({ True: 0.8, False: 0.2 });
      });
    });

    describe('When CPT has more than two states', () => {
      beforeEach(() => {
        component = renderComponent({
          ...defaultProps,
          cptObject: {
            State1: 0.25,
            State2: 0.25,
            State3: 0.25,
            State4: 0.25,
          },
        });
      });

      it('updates changed state', () => {
        const { getByTestId } = component;
        const inputCptState3 = getByTestId(getComponentTestId('InputCpt', 'State3'));

        fireEvent.change(inputCptState3, { target: { value: 0.5 } });

        expect(defaultProps.onChange).toHaveBeenCalledWith({
          State1: 0.25,
          State2: 0.25,
          State3: 0.5,
          State4: 0.25,
        });
      });
    });
  });
});
