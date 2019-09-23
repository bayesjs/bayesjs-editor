import React from 'react';
import { render } from '@testing-library/react';
import NodeCptStatesThead from './index';

const renderComponent = (props) => {
  const { container } = render(
    <NodeCptStatesThead {...props} />,
  );

  return container.firstChild;
};

describe('NodeCptStatesThead Component', () => {
  let component;
  const defaultProps = {
    states: [
      'State 1',
      'State 2',
      'State 3',
    ],
  };

  beforeEach(() => {
    component = renderComponent(defaultProps);
  });

  it('matches snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
