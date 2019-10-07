import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Modal from 'react-modal';
import EditNodeStatesModal from './component';

const renderComponent = (props) => {
  Modal.setAppElement(document.body);

  return {
    ...render(<EditNodeStatesModal {...props} />),
    element: document.body.lastChild,
  };
};

describe('EditNodeStatesModal Component', () => {
  const defaultProps = {
    node: {
      id: 'node 1',
      states: [
        'True',
        'False',
      ],
      parents: [],
    },
    onSave: jest.fn(),
    onCancel: jest.fn(),
    onAlert: jest.fn(),
  };
  let component;

  beforeEach(() => {
    defaultProps.onSave.mockClear();
    defaultProps.onCancel.mockClear();
    defaultProps.onAlert.mockClear();
    component = renderComponent(defaultProps);
  });

  it('matches snapshot', () => {
    expect(component.element).toMatchSnapshot();
  });

  describe('When add a new state', () => {
    describe('and is a valid one', () => {
      const newState = 'New State';

      beforeEach(() => {
        const { getByPlaceholderText, getByTitle } = component;
        const addStateInput = getByPlaceholderText('Novo estado');
        const addStateButton = getByTitle('Adicionar Estado');

        fireEvent.change(addStateInput, { target: { value: newState } });
        fireEvent.click(addStateButton);
      });

      it('does not call onAlert function', () => {
        expect(defaultProps.onAlert).not.toBeCalled();
      });
    });

    describe('and is a invalid one', () => {
      const newState = 'True';

      beforeEach(() => {
        const { getByPlaceholderText, getByTitle } = component;
        const addStateInput = getByPlaceholderText('Novo estado');
        const addStateButton = getByTitle('Adicionar Estado');

        fireEvent.change(addStateInput, { target: { value: newState } });
        fireEvent.click(addStateButton);
      });

      it('calls onAlert function', () => {
        expect(defaultProps.onAlert).toBeCalledWith(`O estado "${newState}" já foi adicionado.`);
      });
    });
  });

  describe('When clicked in save button', () => {
    describe('and has states', () => {
      beforeEach(() => {
        const { getByText } = component;
        const saveButton = getByText('Salvar');

        fireEvent.click(saveButton);
      });

      it('calls onSave function', () => {
        expect(defaultProps.onSave).toBeCalledWith(['True', 'False']);
      });
    });

    describe('and has no states', () => {
      beforeEach(() => {
        const { getByText, getAllByTitle } = component;
        const saveButton = getByText('Salvar');
        const deleteButtons = getAllByTitle('Remover Estado');

        deleteButtons.forEach(fireEvent.click);
        fireEvent.click(saveButton);
      });

      it('calls onAlert function', () => {
        expect(defaultProps.onAlert).toBeCalledWith('Você deve informar pelo menos um estado.');
      });
    });
  });
});
