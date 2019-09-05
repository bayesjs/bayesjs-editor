import { shallow } from 'enzyme';
import React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
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
  let component;

  beforeEach(() => {
    component = shallowComponent();
  });

  it('matches snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('has id and type as prop id', () => {
    expect(component.find(ContextMenu).prop('id')).toBe(`${defaultProps.id}${defaultProps.type}`);
  });


  describe('Event Listeners', () => {
    const target = {
      getBoundingClientRect: () => ({ x: 15, y: 15 }),
    };
    const onShowEvent = {
      detail: {
        position: { x: 50, y: 20 },
        data: {
          target,
        },
      },
    };

    describe('When click in the first item', () => {
      const { onClick } = defaultProps.items[0];
      const onClickEvent = {};

      it('triggers onClick with event and mouse position', () => {
        component.find(ContextMenu).prop('onShow')(onShowEvent);
        component.find(MenuItem).first().prop('onClick')(onClickEvent);

        expect(onClick).toHaveBeenCalledWith({
          ...onClickEvent,
          mousePosition: {
            x: 35,
            y: 5,
          },
        });
      });
    });
  });
});
