import React, { useState } from 'react';
import ContextMenuItemsPortal from 'portals/ContextMenuItems';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import PropTypes from 'prop-types';
import {
  merge,
  complement,
  isNil,
  is,
  join,
  concat,
} from 'ramda';
import { contextMenuItemPropTypes } from 'models';
import { subtractPositions } from 'utils/position';
import { getComponentTestId } from 'utils/test-utils';
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
  type,
  items,
  data,
}) => {
  const [mousePosition, setMousePosition] = useState();

  return (
    <ContextMenuItemsPortal>
      <ContextMenu
        className={styles.contextMenu}
        id={concat(id, type)}
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
  type: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(contextMenuItemPropTypes).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
};

ContextMenuItems.defaultProps = {
  data: null,
};

export default ContextMenuItems;
