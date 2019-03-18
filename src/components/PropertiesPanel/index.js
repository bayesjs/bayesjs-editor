import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSelectedNode, getSelectedSubnetwork } from '../../selectors';

import GenericPanel from '../GenericPanel';
import PropertiesNetwork from '../PropertiesNetwork';
import PropertiesNode from '../PropertiesNode';
import PropertiesSuperNode from '../PropertiesSuperNode';
import styles from './styles.css';
import { nodePropTypes, subnetworkPropTypes } from '../../models';

class PropertiesPanel extends Component {
  renderContent = () => {
    const {
      selectedNode,
      onEditNodeStates,
      onEditNodeCpt,
      onStartConnection,
      selectedSubnetwork,
      onViewSubnetwork,
      onViewLinkages,
    } = this.props;

    if (selectedNode) {
      return (
        <PropertiesNode
          node={selectedNode}
          onEditNodeStates={onEditNodeStates}
          onEditNodeCpt={onEditNodeCpt}
        />
      );
    } if (selectedSubnetwork) {
      return (
        <PropertiesSuperNode
          subnetwork={selectedSubnetwork}
          onStartConnection={onStartConnection}
          onViewSubnetwork={onViewSubnetwork}
          onViewLinkages={onViewLinkages}
        />
      );
    }

    return (
      <PropertiesNetwork />
    );
  };

  render() {
    return (
      <GenericPanel classNames={styles.genericPanel}>
        {this.renderContent()}
      </GenericPanel>
    );
  }
}

PropertiesPanel.propTypes = {
  selectedNode: nodePropTypes.isRequired,
  onEditNodeStates: PropTypes.func.isRequired,
  onEditNodeCpt: PropTypes.func.isRequired,
  onStartConnection: PropTypes.func.isRequired,
  onViewSubnetwork: PropTypes.func.isRequired,
  onViewLinkages: PropTypes.func.isRequired,
  selectedSubnetwork: subnetworkPropTypes.isRequired,
};

const mapStateToProps = state => ({
  selectedNode: getSelectedNode(state),
  selectedSubnetwork: getSelectedSubnetwork(state),
});

export default connect(mapStateToProps)(PropertiesPanel);
