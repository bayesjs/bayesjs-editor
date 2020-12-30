import { fireEvent, render } from '@testing-library/react';

import NodeCptEditTable from './index';
import React from 'react';
import { getComponentTestId } from '@utils/test-utils';
import { head } from 'ramda';

const renderComponent = props =>
  render(
    <NodeCptEditTable {...props} />,
  );

describe('NodeCptEditTable Component', () => {
  let component;

  describe('When node has no parents', () => {
    const props = {
      cpt: {
        True: 0.5,
        False: 0.5,
      },
      hasParents: false,
      states: [
        'True',
        'False',
      ],
      onChange: jest.fn(),
      onKeyUp: jest.fn(),
    };

    beforeEach(() => {
      props.onChange.mockClear();
      props.onKeyUp.mockClear();
      component = renderComponent(props);
    });

    it('matches snapshot', () => {
      expect(component.container.firstChild).toMatchSnapshot();
    });

    describe('When cpt changed', () => {
      it('returns new cpt', () => {
        const { getByTestId } = component;
        const inputCptTrue = getByTestId(getComponentTestId('InputCpt', 'True'));

        fireEvent.change(inputCptTrue, { target: { value: 0.6 } });

        expect(props.onChange).toHaveBeenCalledWith({ True: 0.6, False: 0.4 });
      });
    });
  });

  describe('When node has parents', () => {
    const props = {
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
      hasParents: true,
      states: [
        'True',
        'False',
      ],
      onChange: jest.fn(),
      onKeyUp: jest.fn(),
    };

    beforeEach(() => {
      component = renderComponent(props);
    });

    it('matches snapshot', () => {
      expect(component.container.firstChild).toMatchSnapshot();
    });

    describe('When cpt changed', () => {
      it('returns new cpt', () => {
        const { getAllByTestId } = component;
        const inputCptTrue = head(getAllByTestId(getComponentTestId('InputCpt', 'True')));

        fireEvent.change(inputCptTrue, { target: { value: 0.7 } });

        expect(props.onChange).toHaveBeenCalledWith([
          {
            when: {
              'Node 2': 'True',
              'Node 1': 'True',
            },
            then: {
              True: 0.7,
              False: 0.3,
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
        ]);
      });
    });
  });
});
