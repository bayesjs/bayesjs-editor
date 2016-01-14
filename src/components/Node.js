import React, { Component } from 'react';
import styles from './Node.css';

class Node extends Component {
  render() {
    const { id } = this.props;

    return (
      <div className={styles.node}>{id}</div>
    );
  }
}

export default Node;
