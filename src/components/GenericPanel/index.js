import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { changeNetworkProperty } from '../../actions';
import { getPanelVisibility } from '../../selectors';
import Button from '../Button';
import styles from './styles.css';

class GenericPanel extends Component {
  constructor(props) {
    super(props);
  }

  getArrow = (visible) => {
    const arrowDirection = visible ? 'right' : 'left';

    return (
      <i className={`fa fa-arrow-${arrowDirection}`} />
    );
  };

  handleToggleClick = (visible, dispatch) => () => {
    const action = changeNetworkProperty(
      'propertiesPanelVisible',
      !visible
    );

    dispatch(action);
  };

  render() {
    const { visible, children, dispatch } = this.props;

    return (
      <div
        className={classNames({
          [styles.panel]: true,
          [styles.panelShown]: visible
        })}
      >
        <Button
          className={styles.toggleButton}
          onClick={this.handleToggleClick(visible, dispatch)}
          title={visible ? 'Recolher' : 'Expandir'}
        >
          {this.getArrow(visible)}
        </Button>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visible: getPanelVisibility(state),
});

export default connect(mapStateToProps)(GenericPanel);