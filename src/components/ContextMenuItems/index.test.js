import { shallow } from 'enzyme';
import React from 'react';
import { ContextMenu } from 'react-contextmenu';
import ContextMenuItems from './index';

const defaultProps = {
  id: 'id',
  type: 'type',
  items: [
    {
      key: '1',
      text: 'Item 1',
      disabled: () => false,
      onClick: jest.fn(),
    },
    {
      key: '2',
      text: 'Item 2',
      disabled: true,
      onClick: jest.fn(),
    },
    {
      key: '3',
      text: 'Item 3',
      onClick: jest.fn(),
    },
  ],
  data: null,
};

const shallowComponent = () =>
  shallow(<ContextMenuItems {...defaultProps} />);

describe('ContextMenuItems Component', () => {
  it('matches snapshot', () => {
    const component = shallowComponent();

    expect(component).toMatchSnapshot();
  });

  it('has id and type as prop id', () => {
    const component = shallowComponent();

    expect(component.find(ContextMenu).prop('id')).toBe(`${defaultProps.id}${defaultProps.type}`);
  });
});
