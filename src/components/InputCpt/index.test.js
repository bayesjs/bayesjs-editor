import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import InputCpt from './index';

const renderComponent = (props) => {
  const { container } = render(
    <InputCpt {...props} />,
  );

  return container.firstChild;
};

describe('InputCpt Component', () => {
  let component;
  const defaultProps = {
    id: 'id',
    onChange: jest.fn(),
    value: 0,
  };

  beforeEach(() => {
    defaultProps.onChange.mockClear();
    component = renderComponent(defaultProps);
  });

  it('matches snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  describe('When the value type is higher than one', () => {
    it('returns one as new value', () => {
      fireEvent.change(component, { target: { value: 2 } });

      expect(defaultProps.onChange).toHaveBeenCalledWith(1);
    });
  });

  describe('When the value type is between zero and one', () => {
    it('returns the value', () => {
      fireEvent.change(component, { target: { value: 0.5 } });

      expect(defaultProps.onChange).toHaveBeenCalledWith(0.5);
    });
  });

  describe('When the value type is lower than zero', () => {
    it('returns zero as new value', () => {
      fireEvent.change(component, { target: { value: -1 } });

      expect(defaultProps.onChange).toHaveBeenCalledWith(0);
    });
  });
});
