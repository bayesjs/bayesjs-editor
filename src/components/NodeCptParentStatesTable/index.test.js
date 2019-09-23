import React from 'react';
import { render } from '@testing-library/react';
import NodeCptParentStatesTable from './index';

const renderComponent = (props) => {
  const { container } = render(
    <NodeCptParentStatesTable {...props} />,
  );

  return container.firstChild;
};

describe('NodeCptParentStatesTable Component', () => {
  let component;
  const defaultProps = {
    node: {
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
  };

  beforeEach(() => {
    component = renderComponent(defaultProps);
  });

  it('matches snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
