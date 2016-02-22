import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class ConditionalProbabilityTable extends Component {
  static propTypes = {
    node: PropTypes.object
  };

  render() {
    return this.props.node !== null ? this.renderCpt() : null;
  }

  renderCpt() {
    const { states, cpt } = this.props.node;

    return (
      <table>
        <thead>
          <tr>
            {states.map(state => <th key={state}>{state}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            {states.map(state => <td key={state}>{cpt[state]}</td>)}
          </tr>
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = state => {
  const { list, selectedNodeId } = state.nodes;

  let node = null;

  if (selectedNodeId !== null) {
    node = list.find(n => n.id === selectedNodeId);
  }

  return {
    node
  };
};

export default connect(mapStateToProps)(ConditionalProbabilityTable);
