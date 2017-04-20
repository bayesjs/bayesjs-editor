import React, { PropTypes, Component } from "react";
import { connect } from 'react-redux';
import Network from "../Network";
import Arrow from "../Arrow";
import Node from "../Node";

class SubNetwork extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNodeId: null
    };
  }

  onSetBelief = () => {

  };

  onSelectNodes = (nodes) => {
    let selectedNodeId = null;

    if (nodes.length > 0) {
      selectedNodeId = nodes[0];
    }

    this.setState({ selectedNodeId });
  };

  renderArrow = (arrow, props) => {
    return (
      <Arrow 
        key={arrow.key} 
        from={arrow.from}
        to={arrow.to}
        markEnd={true}
        {...props}
      />
    );
  };

  renderNode = (node, props) => (
    <Node
      key={node.id}
      id={node.id}
      states={node.states}
      results={this.props.inferenceResults[node.id]}
      selected={this.state.selectedNodeId == node.id}
      belief={this.props.network.beliefs[node.id]}
      x={node.position.x}
      y={node.position.y}
      onStateDoubleClick={(state) => this.onSetBelief(node, state)}
      {...props}
    />
  );

  getArrows = () => {
    const { nodes } = this.props;
    let arrows = [];

    nodes.forEach(node => {
      node.parents.forEach(parentId => {
        const parent = nodes.find(x => x.id === parentId);
        
        arrows.push({ 
          from: parent,
          to: node,
        });
      });
    });

    return arrows;
  };

  render() {
    const empty = () => {};
    
    return (
      <Network 
        network={this.props.network}
        nodes={this.props.nodes}
        arrows={this.getArrows}
        renderNode={this.renderNode}
        renderArrow={this.renderArrow}
        requestCreateNode={empty}
        onAddConnection={empty}
        onCancelConnection={empty}
        onSelectNodes={this.onSelectNodes}
        onDoubleClickNode={this.props.onDoubleClickNode}
        getContextItems={() => []}
      />
    );
  }
};

SubNetwork.propTypes = {
  network: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
};

export default SubNetwork;