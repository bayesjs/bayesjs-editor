import { shallow } from 'enzyme';
import React from 'react';
import ContextMenuTrigger from './index';

const defaultProps = {
  id: 'id',
  type: 'type',
  children: <div />,
};

const shallowComponent = () =>
  shallow(<ContextMenuTrigger {...defaultProps} />);

describe('ContextMenuTrigger Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });

  it('has id and type as prop id', () => {
    const component = shallowComponent();

    expect(component.prop('id')).toBe(`${defaultProps.id}${defaultProps.type}`);
  });
});
