import React, { Component } from 'react';
import Header from '../Header';
import Canvas from '../Canvas';
import PropertiesPanel from '../PropertiesPanel';
import EditStatesModal from '../EditStatesModal';
import EditCptModal from '../EditCptModal';
import styles from './styles.css';

class App extends Component {
  state = {
    key: 1,
    editingNodeStates: null,
    editingNodeCpt: null,
  };

  handleRequestRedraw = () => {
    setTimeout(() => {
      this.canvas.getWrappedInstance().calculateArrows();
      this.setState({ key: this.state.key + 1 });
    }, 0);
  };

  render() {
    return (
      <div className={styles.app}>
        <Header onRequestRedraw={this.handleRequestRedraw} />

        <div className={styles.container}>
          <Canvas
            ref={ref => (this.canvas = ref)}
            onEditNodeStates={node => this.setState({ editingNodeStates: node })}
            onEditNodeCpt={node => this.setState({ editingNodeCpt: node })}
          />
          <PropertiesPanel
            key={this.state.key}
            onEditNodeStates={node => this.setState({ editingNodeStates: node })}
            onEditNodeCpt={node => this.setState({ editingNodeCpt: node })}
          />
        </div>

        <EditStatesModal
          node={this.state.editingNodeStates}
          onRequestClose={() => {
            this.setState({ editingNodeStates: null });
            this.handleRequestRedraw();
          }}
        />

        <EditCptModal
          node={this.state.editingNodeCpt}
          onRequestClose={() => this.setState({ editingNodeCpt: null })}
        />
      </div>
    );
  }
}

export default App;
