import React from 'react';
import { render } from '@testing-library/react';
import NodeStatesEditList from './index';

const renderComponent = (props) => {
  const { container } = render(
    <NodeStatesEditList {...props} />,
  );

  return container.firstChild;
};

describe('NodeStatesEditList Component', () => {
  const defaultProps = {
    states: [
      'State 1',
      'State 2',
      'State 3',
    ],
    onDeleteState: jest.fn(),
  };
  let component;

  beforeEach(() => {
    component = renderComponent(defaultProps);
  });

  it('matches snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
