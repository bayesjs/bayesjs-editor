import React, { Component, PropTypes } from 'react';
import {  } from '../../actions';
import Modal from '../Modal';
import Button from '../Button';
import styles from './styles.css';

class LinkagesModal extends Component {
  constructor(props) {
    super(props);

    const { linkages } = this.props;
    const count = this.generateCountDict(linkages);

    this.state = {
      linkagesList: this.getList(linkages, count),
      deletedLinkages: [],
    };
  }

  onDeleteLinkage = (id, index) => (e) => {
    const { deletedLinkages, linkagesList } = this.state;

    this.setState({
      deletedLinkages: [
        ...deletedLinkages,
        id
      ],
      linkagesList: linkagesList.filter((_, i) => i != index)
    })
  };

  getTableRow = ({ id, linkage: [l1, l2] }, i) => {
    const { subnetworksById } = this.props;
    const netId1 = l1.networkId;
    const netId2 = l2.networkId;

    return (
      <tr key={i}>
        <td>{subnetworksById[netId1]}</td>
        <td>{l1.nodeId}</td>
        <td>{subnetworksById[netId2]}</td>
        <td>{l2.nodeId}</td>
        <td>
          <Button
            onClick={this.onDeleteLinkage(id, i)}
            title="Remover Link"
          >
            <i className="fa fa-trash" />
          </Button>
        </td>
      </tr>
    );
  };

  createTable = (linkagesList) => {
    if (linkagesList.length === 0) {
      return (
        <div className={styles.message}>
          <span>Sem conexões</span>
        </div>
      );
    }

    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Rede 1</th>
            <th>Node 1</th>
            <th>Rede 2</th>
            <th>Node 2</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {linkagesList.sort(this.sort(this.props.subnetworksById)).map(this.getTableRow)}
        </tbody>
      </table>
    );
  };

  generateCountDict = (linkages) => {
    const ids = Object.keys(linkages);
    const count = (obj, id) => obj[id] ? ++obj[id] : 1;
    
    return ids.reduce((p, id) => {
      const [l1, l2] = linkages[id];

      p[l1.networkId] = count(p, l1.networkId);
      p[l2.networkId] = count(p, l2.networkId);
      return p;
    }, {});
  };

  sort = (names) => (linkage1, linkage2) => {
    const netName = (link, i = 0) => names[link.linkage[i].networkId]
    const node = (link, i = 0) => link.linkage[i].nodeId;
    const netA1 = netName(linkage1);
    const netA2 = netName(linkage2);
    const netB1 = netName(linkage1, 1);
    const netB2 = netName(linkage2, 1);
    const nodeA1 = node(linkage1);
    const nodeA2 = node(linkage2);
    const nodeB1 = node(linkage1, 1);
    const nodeB2 = node(linkage2, 1);
    
    if (netA1 > netA2) return 1;
    else if (netA1 < netA2) return -1;
    else if (netB1 > netB2) return 1;
    else if (netB1 < netB2) return -1;
    else if (nodeA1 < nodeA2) return -1;
    else if (nodeA1 > nodeA2) return 1
    else if (nodeB1 < nodeB2) return -1;
    else if (nodeB1 > nodeB2) return 1
    
    return 0;
  }

  getList = (linkages, count) => {
    const ids = Object.keys(linkages);
    const order = (linkage) => {
      const [l1, l2] = linkage;

      if (count[l2.networkId] > count[l1.networkId]) {
        return [l2, l1];
      }
      return linkage;
    };
    
    return ids.reduce((p, id) => {
      p.push({
        id,
        linkage: order(linkages[id]),
      });
      return p;
    }, []);
  };

  onRequestClose = (canceled) => () => {
    const { onRequestClose } = this.props;
    const { deletedLinkages } = this.state;

    onRequestClose(canceled ? [] : deletedLinkages);
  };

  render() {
    const { visible } = this.props;
    const { linkagesList } = this.state;

    return (
      <Modal
        title="Editar Uniões"
        isOpen={true}
        onRequestClose={this.onRequestClose(true)}
      >
        <div>
          {this.createTable(linkagesList)}

          <div className={styles.buttons}>
            <Button primary onClick={this.onRequestClose(false)}>Salvar</Button>
            <Button onClick={this.onRequestClose(true)}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

LinkagesModal.propTypes = {
  linkages: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  subnetworksById: PropTypes.object.isRequired,
};

export default LinkagesModal;
