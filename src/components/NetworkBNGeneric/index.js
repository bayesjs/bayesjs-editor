import React, { PropTypes, Component } from "react";
import { connect } from 'react-redux';
import Network, { ContextMenuType } from "../Network";
import Node from '../Node';
import AddNodeModal from '../AddNodeModal';
import EditStatesModal from '../EditStatesModal';
import EditCptModal from '../EditCptModal';
import Arrow from '../Arrow';

class NetworkBNGeneric extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: 1
    };
  }

  onEditNodeStates = (editingNodeStates) => {
    this.setState({ editingNodeStates });
  };

  onEditNodeCpt = (editingNodeCpt) => {
    this.setState({ editingNodeCpt });
  };

  renderArrow = (arrow, handleArrowMouseDown) => {
    const onMouseDown = e => handleArrowMouseDown(arrow, e);
    
    return (
      <Arrow 
        key={arrow.key} 
        onMouseDown={onMouseDown}
        from={arrow.from}
        to={arrow.to}
        markEnd={true}
      />
    );
  };

  renderNode = (node, props) => (
    <Node
      key={node.id}
      id={node.id}
      states={node.states}
      results={this.props.inferenceResults[node.id]}
      selected={this.props.network.selectedNodes.some(x => x === node.id)}
      belief={this.props.network.beliefs[node.id]}
      x={node.position.x}
      y={node.position.y}
      {...props}
    />
  );

  changeNetworkProperty = (name, value) => {
    this.props.dispatch(changeNetworkProperty(name, value));
  };

  onSelectNodes = (nodes) => {
    this.props.dispatch(
      changeNetworkProperty('selectedNodes', nodes)
    );
  };

  handleKeyup = (e) => {
    const key = e.keyCode || e.which;
    const { network } = this.props;

    if (key === 8 && network.selectedNodes.length > 0) {
      network.selectedNodes.map((nodeId) => {
        this.props.dispatch(removeNode(nodeId));
      });
      setTimeout(() => this.calculateArrows(), 0);
    }
  }

  onAddConnection = (idFrom, idTo) => {
    this.props.dispatch(addParent(idFrom, idTo));
  };

  onCancelConnection = () => {
    
  };

  onSetBelief = (node, state) => {
    if (this.props.network.beliefs[node.id] === state) {
      this.props.dispatch(setBelief(node.id, null));
    } else {
      this.props.dispatch(setBelief(node.id, state));
    }
  };

  onCreateNode = (position, onRequestClose) => {
    return (
      <AddNodeModal
        position={position}
        onRequestClose={onRequestClose} />
    );
  };

  changeNodePosition = (id, newX, newY) => {
    this.props.dispatch(changeNodePosition(id, newX, newY));
    setTimeout(this.net.renderArrows, 0);
  };

  calculateArrows = () => {
    this.net.renderArrows();
  };

  handleRequestRedraw = () => {
    setTimeout(() => {
      this.calculateArrows();
      this.setState({ key: this.state.key + 1 });
    }, 0);
  };

  getContextItems = (type) => {
    switch (type) {
      case ContextMenuType.ARROW:
        return this.arrowContextMenuItems;
      case ContextMenuType.NODE:
        return this.nodeContextMenuItems;
      case ContextMenuType.CANVAS:
        return this.canvasContextMenuItems;
      default:
        return [];
    }
  };

  helper = () => {

  }

  render() {
    const {} = this.props;
    const { helper } = this;

    return (
      <div>
        <Network
          network={this.props.network}
          nodes={this.props.nodes}
          renderNode={this.renderNode}
          renderArrow={this.renderArrow}
          changeNetworkProperty={this.changeNetworkProperty}
          onAddConnection={this.onAddConnection}
          onCancelConnection={this.onCancelConnection}
          onSelectNodes={this.onSelectNodes}
          changeNodePosition={this.changeNodePosition}
          getContextItems={this.getContextItems}
          onCreateNode={this.onCreateNode}
          onSetBelief={this.onSetBelief}
          ref={ref => (this.net = ref)}
          />
      </div>
    );
  }
}

NetworkBNGeneric.propTypes = {
  dispatch: PropTypes.func.isRequired,
  network: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
};

export default NetworkBNGeneric;