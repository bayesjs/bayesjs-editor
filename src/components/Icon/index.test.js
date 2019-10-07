import React from 'react';
import { render } from '@testing-library/react';
import Icon from './index';

const renderComponent = (props) => {
  const { container } = render(
    <Icon {...props} />,
  );

  return container.firstChild;
};

describe('Icon Component', () => {
  const defaultProps = {
    name: 'search',
  };
  let component;

  beforeEach(() => {
    component = renderComponent(defaultProps);
  });

  it('matches snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
