import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  propertiesPanel: {
    height: '100%',
    position: 'relative',
    transition: 'width 0.15s',
    borderLeft: 'solid 1px #333',
  },
  propertiesPanelShown: {
    width: 280,
  },
  propertiesPanelHidden: {
    width: 0,
  },
  toggleButton: {
    position: 'absolute',
    top: 5,
    right: 10,
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
      <div
        className={css(styles.propertiesPanel,
          this.state.showing ? (
            styles.propertiesPanelShown
          ) : (
            styles.propertiesPanelHidden
          )
        )}
      >
        <button
          className={css(styles.toggleButton)}
          type="button"
          onClick={this.handleToggleClick}
        >
          {this.state.showing ? (
            <i className="fa fa-times" />
          ) : (
            <i className="fa fa-arrow-left" />
          )}
        </button>
      </div>
    );
  }
}

export default PropertiesPanel;
