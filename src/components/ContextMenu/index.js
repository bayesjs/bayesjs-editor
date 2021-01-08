import React, { Fragment } from 'react';

import ContextMenuItems from '@components/ContextMenuItems';
import { ContextMenuTrigger } from 'react-contextmenu';
import PropTypes from 'prop-types';
import { concat } from 'ramda';
import { contextMenuItemPropTypes } from '@models/';

const ContextMenu = ({
  id,
  type,
  items,
  data,
  ...props
}) => {
  const contextMenuId = concat(id, type);

  return (
    <Fragment>
      <ContextMenuTrigger
        id={contextMenuId}
        {...props}
      />

      <ContextMenuItems
        id={contextMenuId}
        items={items}
        data={data}
      />
    </Fragment>
  );
};

ContextMenu.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(contextMenuItemPropTypes),
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
};

ContextMenu.defaultProps = {
  items: [],
  data: null,
};

export default ContextMenu;
