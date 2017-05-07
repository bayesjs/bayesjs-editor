import React, { PropTypes, Component } from "react";
import { connect } from 'react-redux';
import Network, { ContextMenuType } from "../Network";
import Arrow from "../Arrow";
import Node from "../Node";
import NodeGeneric from "../NodeGeneric";

class SubNetwork extends Component {
  constructor(props) {
    super(props);
    const { connecting, onDoubleClickNode, connectingNode } = this.props;

    this.state = {
      selectedNodeId: null,
      addingChildArrow: null,
    };
    
    this.nodeContextMenuItems = [
      {
        key: 'connect-node',
        text: 'Ligar',
        visible: connecting,
        onClick: (contextMenuNode) => {
          onDoubleClickNode(contextMenuNode);
        },
      },
      {
        key: 'linkages-node',
        text: 'Ver Ligações',
        visible: ({ link }) => link,
        onClick: (contextMenuNode) => {
          // onDoubleClickNode(contextMenuNode);
          alert('Nao implementado');
        },
      }
    ];
  }
  
  handleMouseMove = e => {
    if (this.props.connectingNode) {
      const canvasRect = this.networkRef.canvas.getBoundingClientRect();
      const nodeRect = this.connectingNodeRef.getBoundingClientRect();

      const from = {
        x: nodeRect.left + (nodeRect.width / 2) - canvasRect.left,
        y: nodeRect.top + (nodeRect.height / 2) - canvasRect.top,
      };

      const to = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      };

      // Without it, sometimes the mouse is over the adding arrow
      // It needs to be over the node to be added
      to.x += from.x < to.x ? -3 : 3;
      to.y += from.y < to.y ? -3 : 3;

      this.setState({
        addingChildArrow: { from, to },
      });
    }
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

  getLinkedFromNode = ({ id }) => {
    const linkedNodes = this.props.linkedNodes || [];

    return linkedNodes.find(({ nodeId }) => nodeId == id);
  };

  getLinkTitle = ({ connections }) => {
    return connections.reduce((p, c) => {
      const message = `${c.networkName} - ${c.nodeId}`;
      p += message;
      return p;
    }, '');
  };

  onSetBelief = (node) => (state) => {
    const { connecting, onSetBelief, network } = this.props;

    if (!connecting && onSetBelief) {
      onSetBelief(network, node, state);
    }
  }

  renderNode = (node, props) => {
    const { connectingNode, network, inferenceResults } = this.props;
    const key = `${network.name}-${node.id}`;

    if (connectingNode == node) {
      const title = connectingNode.network.name;
      
      return (
        <NodeGeneric
          key={`${key}-view`}
          x="5"
          y="5"
          id={title}
          selected={true}
          sumHeight={17}
          onMouseDown={() => {}}
          rectRef={(ref) => (this.connectingNodeRef = ref)}
        >
          <foreignObject x="5" y="21" height="15" width="150">
            <p
              title={connectingNode.id}
              style={{
                margin: 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {connectingNode.id}
            </p>
          </foreignObject>
        </NodeGeneric>
      );
    }

    const link = this.getLinkedFromNode(node);
    const stroke = link ? 'red' : undefined;
    node.link = link;

    return (
      <Node
        key={key}
        id={node.id}
        states={node.states}
        results={inferenceResults[node.id]}
        selected={this.state.selectedNodeId == node.id}
        belief={network.beliefs[node.id]}
        x={node.position.x}
        y={node.position.y}
        onStateDoubleClick={this.onSetBelief(node)}
        stroke={stroke}
        {...props}
      />
    );
  };

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

  getContextItems = (type) => {
    switch (type) {
      case ContextMenuType.NODE:
        return this.nodeContextMenuItems;
      default:
        return [];
    }
  }

  getNodes = () => {
    const { connectingNode, nodes } = this.props;

    if (connectingNode) {
      return [
        ...nodes,
        connectingNode
      ];
    }

    return nodes;
  };

  render() {
    // console.log('inferenceResults', this.props.inferenceResults);
    const empty = () => {};
    const newNetwork = {
      ...this.props.network,
      height: window.innerHeight * 0.8,
      width: window.innerWidth * 0.8,
    };
    let addingChildArrow = null;

    if (this.state.addingChildArrow !== null) {
      const { from, to } = this.state.addingChildArrow;

      addingChildArrow = (
        <path
          d={`M${from.x},${from.y} ${to.x},${to.y}`}
          fill="none"
          stroke="#333"
          strokeWidth="2"
          strokeDasharray="5,5"
          markerEnd="url(#triangle)"
        />
      );
    }
    
    return (
      <div>
        <Network 
          network={newNetwork}
          nodes={this.getNodes()}
          arrows={this.getArrows}
          renderNode={this.renderNode}
          renderArrow={this.renderArrow}
          requestCreateNode={empty}
          onAddConnection={empty}
          onCancelConnection={empty}
          onSelectNodes={this.onSelectNodes}
          onClickNode={this.props.onClickNode}
          onDoubleClickNode={this.props.onDoubleClickNode}
          getContextItems={this.getContextItems}
          onMouseMove={this.handleMouseMove}
          ref={ref => (this.networkRef = ref)}
        >
         {addingChildArrow}
        </Network>
      </div>
    );
  }
};

SubNetwork.propTypes = {
  network: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  connecting: PropTypes.bool.isRequired,
  connectingNode: PropTypes.object,
  onSetBelief: PropTypes.func,
  inferenceResults: PropTypes.object,
};

export default SubNetwork;