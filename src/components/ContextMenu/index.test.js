import { shallow } from 'enzyme';
import React from 'react';
import ContextMenuItems from 'components/ContextMenuItems';
import { ContextMenuTrigger } from 'react-contextmenu';
import ContextMenu from './index';

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
  children: <div />,
};

const shallowComponent = () =>
  shallow(<ContextMenu {...defaultProps} />);

describe('ContextMenu Component', () => {
  let component;

  beforeEach(() => {
    component = shallowComponent();
  });

  it('matches snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('has id and type as ContextMenuTrigger prop id', () => {
    expect(component.find(ContextMenuTrigger).prop('id')).toBe(`${defaultProps.id}${defaultProps.type}`);
  });

  it('has id and type as ContextMenuItems prop id', () => {
    expect(component.find(ContextMenuItems).prop('id')).toBe(`${defaultProps.id}${defaultProps.type}`);
  });
});
