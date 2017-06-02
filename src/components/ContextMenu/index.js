import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import RenderIntoBody from '../RenderIntoBody';
import styles from './styles.css';

class ContextMenu extends Component {
  state = {
    position: null,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleWindowMouseDown);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleWindowMouseDown);
    window.removeEventListener('mousedown', this.handleWindowMouseDown);
  }

  // setContextItem = (item) => {
  //   this.contextItem = item;
  // }

  hide = () => {
    this.setState({ position: null });
  };

  handleWindowMouseDown = () => {
    window.removeEventListener('mousedown', this.handleWindowMouseDown);
    this.setState({ position: null });
  };

  handleContainerMouseDown = (e, contextItem) => {
    this.contextItem = contextItem;
    // Only right clicks
    if (e.button !== 2) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const position = { x: e.clientX, y: e.clientY };

    this.setState({ position }, () => {
      const newPosition = { ...position };
      const leftOverflow = (position.x + this.menuRef.offsetWidth) - document.body.clientWidth;

      if (leftOverflow > 0) {
        newPosition.x -= leftOverflow;
      }

      if (position.y + this.menuRef.offsetHeight > window.innerHeight) {
        newPosition.y -= this.menuRef.offsetHeight;
      }

      this.setState({ position: newPosition });
    });

    window.addEventListener('mousedown', this.handleWindowMouseDown);
  };

  handleContextMenu = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleMenuItemMouseDown = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    if (!item.disabled) {
      const { contextItem } = this;

      this.handleWindowMouseDown();
      item.onClick(contextItem);
    }
  };

  getItens = (item) => {
    const { items } = this.props;
    
    return items.filter(({ visible }) => {
        if (visible !== undefined) {
          if (typeof visible === 'boolean') {
            return visible;
          } else if (typeof visible === 'function') {
            return visible(this.contextItem);
          }
        }
        return true;
      });
  }

  render() {
    const { position } = this.state;

    if (position === null) {
      return null;
    }

    const style = {
      left: position.x,
      top: position.y,
    };

    return (
      <RenderIntoBody>
        <ul
          className={styles.contextMenu}
          style={style}
          ref={ref => (this.menuRef = ref)}
          onContextMenu={this.handleContextMenu}
        >
          {this.getItens().map((item) => (
            <li
              key={item.key}
              style={item.style || {}}
              className={classNames({
                [styles.contextMenuItem]: true,
                [styles.contextMenuItemDisabled]: item.disabled,
              })}
              onMouseDown={e => this.handleMenuItemMouseDown(e, item)}
            >
              {item.text}
            </li>
          ))}
        </ul>
      </RenderIntoBody>
    );
  }
}

ContextMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  })).isRequired,
};

export default ContextMenu;
