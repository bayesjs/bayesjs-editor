import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { changeNetworkProperty, changeNodeId, NETWORK_KINDS } from '../../actions';
import { getSelectedNode, getNetworkKind, getSelectedSubnetwork } from '../../selectors';
import Button from '../Button';
import styles from './styles.css';
import GenericPanel from '../GenericPanel';
import PropertiesNetwork from '../PropertiesNetwork';
import PropertiesNode from '../PropertiesNode';
import PropertiesSuperNode from '../PropertiesSuperNode';

class PropertiesPanel extends Component {
  constructor(props) {
    super(props);
  }

  renderContent = () => {
    const { 
      selectedNode, 
      networkKind, 
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
    } else if (selectedSubnetwork) {
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
  selectedNode: PropTypes.object,
  networkKind: PropTypes.string.isRequired,
  onEditNodeStates: PropTypes.func.isRequired,
  onEditNodeCpt: PropTypes.func.isRequired,
  onStartConnection: PropTypes.func.isRequired,
  onViewSubnetwork: PropTypes.func.isRequired,
  onViewLinkages: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedNode: getSelectedNode(state),
  selectedSubnetwork: getSelectedSubnetwork(state),
  networkKind: getNetworkKind(state),
});

export default connect(mapStateToProps)(PropertiesPanel);
