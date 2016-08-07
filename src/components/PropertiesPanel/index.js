import React, { Component } from 'react';
import classNames from 'classnames';
import Button from '../Button';
import styles from './styles.css';

class PropertiesPanel extends Component {
  state = {
    showing: false,
  };

  handleToggleClick = () => {
    this.setState({ showing: !this.state.showing });
  };

  render() {
    return (
      <div
        className={classNames({
          [styles.panel]: true,
          [styles.panelShown]: this.state.showing,
        })}
      >
        <Button
          className={styles.toggleButton}
          onClick={this.handleToggleClick}
        >
          <i className="fa fa-sliders" />Propriedades
        </Button>
        <div className={styles.content}>
          ...
        </div>
      </div>
    );
  }
}

export default PropertiesPanel;
