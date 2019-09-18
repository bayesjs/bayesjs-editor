import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { getComponentTestId } from 'utils/test-utils';
import { head } from 'ramda';
import Modal from 'react-modal';
import * as nodeValidation from 'validations/node';
import * as eventUtils from 'utils/event';
import EditNodeCptModal from './component';

const renderComponent = (props) => {
  Modal.setAppElement(document.body);

  return {
    ...render(<EditNodeCptModal {...props} />),
    element: document.body.lastChild,
  };
};

describe('EditNodeCptModal Component', () => {
  let component;

  describe('When node has no parents', () => {
    const props = {
      node: {
        id: 'Node 1',
        states: [
          'True',
          'False',
        ],
        parents: [],
        cpt: {
          True: 0.5,
          False: 0.5,
        },
      },
      hasParents: false,
      onSave: jest.fn(),
      onCancel: jest.fn(),
      onAlert: jest.fn(),
    };

    beforeEach(() => {
      component = renderComponent(props);
    });

    it('matches snapshot', () => {
      expect(component.element).toMatchSnapshot();
    });

    describe('When key pressed in cpt input', () => {
      beforeEach(() => {
        props.onSave.mockClear();
      });

      describe('and is "enter" key', () => {
        const { isEnterKey } = eventUtils;

        beforeEach(() => {
          const { getAllByTestId } = component;
          const inputCptTrueState = head(getAllByTestId(getComponentTestId('InputCpt', 'True')));

          eventUtils.isEnterKey = () => true;
          fireEvent.keyUp(inputCptTrueState);
        });

        afterAll(() => {
          eventUtils.isEnterKey = isEnterKey;
        });

        it('calls onSave fucntion', () => {
          expect(props.onSave).toHaveBeenCalledWith(props.node.cpt);
        });
      });

      describe('and is not "enter" key', () => {
        const { isEnterKey } = eventUtils;

        beforeEach(() => {
          const { getAllByTestId } = component;
          const inputCptTrueState = head(getAllByTestId(getComponentTestId('InputCpt', 'True')));

          eventUtils.isEnterKey = () => false;
          fireEvent.keyUp(inputCptTrueState);
        });

        afterAll(() => {
          eventUtils.isEnterKey = isEnterKey;
        });

        it('does not call onSave fucntion', () => {
          expect(props.onSave).not.toHaveBeenCalled();
        });
      });
    });

    describe('When saving', () => {
      beforeEach(() => {
        props.onSave.mockClear();
        props.onAlert.mockClear();
      });

      describe('and cpt is valid', () => {
        beforeEach(() => {
          const { getByText } = component;
          const saveButton = getByText('Salvar');

          fireEvent.click(saveButton);
        });

        it('calls onSave function with cpt', () => {
          expect(props.onSave).toHaveBeenCalledWith(props.node.cpt);
        });
      });

      describe('and cpt is invalid', () => {
        const { isNodeCptValid } = nodeValidation;

        beforeEach(() => {
          const { getByText } = component;
          const saveButton = getByText('Salvar');

          nodeValidation.isNodeCptValid = () => false;
          fireEvent.click(saveButton);
        });

        afterAll(() => {
          nodeValidation.isNodeCptValid = isNodeCptValid;
        });

        it('calls onAlert function with message', () => {
          expect(props.onAlert).toHaveBeenCalledWith('A soma das probabilidades para cada uma das linhas deve ser igual a 1');
        });
      });
    });
  });


  describe('When node has parents', () => {
    const props = {
      node: {
        id: 'Node 3',
        states: [
          'True',
          'False',
        ],
        parents: [
          'Node 2',
          'Node 1',
        ],
        cpt: [
          {
            when: {
              'Node 2': 'True',
              'Node 1': 'True',
            },
            then: {
              True: 0.5,
              False: 0.5,
            },
          },
          {
            when: {
              'Node 2': 'False',
              'Node 1': 'True',
            },
            then: {
              True: 0.5,
              False: 0.5,
            },
          },
          {
            when: {
              'Node 2': 'True',
              'Node 1': 'False',
            },
            then: {
              True: 0.5,
              False: 0.5,
            },
          },
          {
            when: {
              'Node 2': 'False',
              'Node 1': 'False',
            },
            then: {
              True: 0.5,
              False: 0.5,
            },
          },
        ],
      },
      hasParents: true,
      onSave: jest.fn(),
      onCancel: jest.fn(),
      onAlert: jest.fn(),
    };

    beforeEach(() => {
      component = renderComponent(props);
    });

    it('matches snapshot', () => {
      expect(component.element).toMatchSnapshot();
    });

    describe('When key pressed in cpt input', () => {
      beforeEach(() => {
        props.onSave.mockClear();
      });

      describe('and is "enter" key', () => {
        const { isEnterKey } = eventUtils;

        beforeEach(() => {
          const { getAllByTestId } = component;
          const inputCptTrueState = head(getAllByTestId(getComponentTestId('InputCpt', 'True')));

          eventUtils.isEnterKey = () => true;
          fireEvent.keyUp(inputCptTrueState);
        });

        afterAll(() => {
          eventUtils.isEnterKey = isEnterKey;
        });

        it('calls onSave fucntion', () => {
          expect(props.onSave).toHaveBeenCalledWith(props.node.cpt);
        });
      });

      describe('and is not "enter" key', () => {
        const { isEnterKey } = eventUtils;

        beforeEach(() => {
          const { getAllByTestId } = component;
          const inputCptTrueState = head(getAllByTestId(getComponentTestId('InputCpt', 'True')));

          eventUtils.isEnterKey = () => false;
          fireEvent.keyUp(inputCptTrueState);
        });

        afterAll(() => {
          eventUtils.isEnterKey = isEnterKey;
        });

        it('does not call onSave fucntion', () => {
          expect(props.onSave).not.toHaveBeenCalled();
        });
      });
    });

    describe('When saving', () => {
      beforeEach(() => {
        props.onSave.mockClear();
        props.onAlert.mockClear();
      });

      describe('and cpt is valid', () => {
        beforeEach(() => {
          const { getByText } = component;
          const saveButton = getByText('Salvar');

          fireEvent.click(saveButton);
        });

        it('calls onSave function with cpt', () => {
          expect(props.onSave).toHaveBeenCalledWith(props.node.cpt);
        });
      });

      describe('and cpt is invalid', () => {
        const { isNodeCptValid } = nodeValidation;

        beforeEach(() => {
          const { getByText } = component;
          const saveButton = getByText('Salvar');

          nodeValidation.isNodeCptValid = () => false;
          fireEvent.click(saveButton);
        });

        afterAll(() => {
          nodeValidation.isNodeCptValid = isNodeCptValid;
        });

        it('calls onAlert function with message', () => {
          expect(props.onAlert).toHaveBeenCalledWith('A soma das probabilidades para cada uma das linhas deve ser igual a 1');
        });
      });
    });
  });
});
