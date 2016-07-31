import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import Button from './Button';

const styles = StyleSheet.create({
  panel: {
    display: 'flex',
    position: 'relative',
    width: 50,
    borderLeft: 'solid 1px #333',
  },
  panelShown: {
    width: 300,
  },
  content: {
    margin: '10px 50px 10px 10px',
    overflow: 'auto',
    flex: 1,
  },
  toggleButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 30,
    whiteSpace: 'nowrap',
    transform: 'translate(100%, 0%) rotate(90deg)',
    transformOrigin: 'left top',
  },
});

class PropertiesPanel extends Component {
  state = {
    showing: true,
  };

  handleToggleClick = () => {
    this.setState({ showing: !this.state.showing });
  };

  render() {
    return (
      <div className={css(styles.panel, this.state.showing && styles.panelShown)}>
        <Button onClick={this.handleToggleClick} style={styles.toggleButton}>
          <i className="fa fa-sliders" style={{ paddingRight: 10 }} />
          Propriedades
        </Button>
        <div className={css(styles.content)}>
          ...
        </div>
      </div>
    );
  }
}

export default PropertiesPanel;
