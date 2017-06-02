import flatColors from 'flat-palettes';

import {
  NEW_NETWORK,
  ADD_SUPER_NODE,
  REMOVE_SUPER_NODE,
  LOAD_NETWORK,
} from '../actions';

const colorsBuilder = () => {
  let list = [];
  // const allColors = ['#455A64','#37474F','#263238','#E64A19','#D84315','#BF360C','#5D4037','#4E342E','#3E2723','#616161','#424242','#212121','#FBC02D','#F9A825','#F57F17','#FFA000','#FF8F00','#FF6F00','#F57C00','#EF6C00','#E65100','#388E3C','#2E7D32','#1B5E20','#689F38','#558B2F','#33691E','#AFB42B','#9E9D24','#827717','#0288D1','#0277BD','#01579B','#0097A7','#00838F','#006064','#00796B','#00695C','#004D40','#512DA8','#4527A0','#311B92','#303F9F','#283593','#1A237E','#1976D2','#1565C0','#0D47A1','#D32F2F','#C62828','#B71C1C','#C2185B','#AD1457','#880E4F','#7B1FA2','#6A1B9A','#4A148C'];
  const allColors = ["#D84315","#BF360C","#FBC02D","#F9A825","#F57F17","#FFA000","#FF8F00","#FF6F00","#F57C00","#EF6C00","#E65100","#388E3C","#2E7D32","#689F38","#558B2F","#AFB42B","#0288D1","#0097A7","#00838F","#1976D2","#1565C0","#C2185B"];
  const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };
  
  return () => {
    if (list.length == 0) {
      list = shuffle([...allColors]);
    }

    return list.shift()
  };
}

const colorsNol = colorsBuilder();

const formatNetwork = (state) => {
  const { network, positions, nodes } = state;

  if (nodes && positions) {
    return {
      ...network,
      nodes,
      positions,
      color: colorsNol()
    };
  }
  
  return network;
}

export default (state = [], action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return [];
    case ADD_SUPER_NODE:
      return [
        ...state,
        formatNetwork(action.payload.state),
      ];
    case REMOVE_SUPER_NODE:
      return state
        .filter(n => n.id != action.payload.id)

    case LOAD_NETWORK:
      const { subnetworks } = action.payload.state.network;
      return subnetworks || [];
    default: 
      return state;
  }
}