import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NodeStateEdit from './index';

const renderComponent = props =>
  render(
    <NodeStateEdit {...props} />,
  );

describe('NodeStateEdit Component', () => {
  const defaultProps = {
    state: 'State Test',
    index: 2,
    onDeleteState: jest.fn(),
  };
  let component;

  beforeEach(() => {
    defaultProps.onDeleteState.mockClear();
    component = renderComponent(defaultProps);
  });

  it('matches snapshot', () => {
    expect(component.container.firstChild).toMatchSnapshot();
  });

  describe('When clicked in remove button', () => {
    beforeEach(() => {
      const { getByTitle } = component;
      const removeButton = getByTitle('Remover Estado');

      fireEvent.click(removeButton);
    });

    it('calls onDeleteState function', () => {
      expect(defaultProps.onDeleteState).toBeCalledWith({
        state: defaultProps.state,
        index: defaultProps.index,
      });
    });
  });
});
