import { ContextMenu, MenuItem } from 'react-contextmenu';
import React, { useState } from 'react';
import {
  complement,
  is,
  isNil,
  join,
  merge,
} from 'ramda';

import ContextMenuItemsPortal from '@portals/ContextMenuItems';
import PropTypes from 'prop-types';
import { contextMenuItemPropTypes } from '@models';
import { getComponentTestId } from '@utils/test-utils';
import { subtractPositions } from '@utils/position';
import styles from './styles.css';

const isNotNil = complement(isNil);
const isFunction = is(Function);

const onShowHandler = setMousePosition => ({ detail: { position, data: { target } } }) => {
  const targetPosition = target.getBoundingClientRect();
  const finalPosition = subtractPositions(position, targetPosition);

  setMousePosition(finalPosition);
};

const onClickHandler = ({ onClick }, mousePosition) => (event, ...args) =>
  onClick(merge(event, { mousePosition }), ...args);

const isItemDisabled = ({ disabled }, data) => {
  if (isNotNil(disabled)) {
    return isFunction(disabled) ? disabled(data) : disabled;
  }

  return false;
};

const getItemClasses = isDisabled =>
  join(' ', [
    styles.contextMenuItem,
    ...(isDisabled ? [styles.contextMenuItemDisabled] : []),
  ]);

const ContextMenuItems = ({
  id,
  items,
  data,
}) => {
  const [mousePosition, setMousePosition] = useState();

  return (
    <ContextMenuItemsPortal>
      <ContextMenu
        className={styles.contextMenu}
        id={id}
        onShow={onShowHandler(setMousePosition)}
      >
        {items.map(({
          key,
          text,
          style,
          ...itemProps
        }) => {
          const isDisabled = isItemDisabled(itemProps, data);
          const classNames = getItemClasses(isDisabled);

          return (
            <MenuItem
              key={key}
              onClick={onClickHandler(itemProps, mousePosition)}
              data={data}
              disabled={isDisabled}
            >
              <div
                className={classNames}
                style={style}
                data-testid={getComponentTestId('ContextMenuItems', key)}
                children={text}
              />
            </MenuItem>
          );
        })}
      </ContextMenu>
    </ContextMenuItemsPortal>
  );
};

ContextMenuItems.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(contextMenuItemPropTypes).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
};

ContextMenuItems.defaultProps = {
  data: null,
};

export default ContextMenuItems;
