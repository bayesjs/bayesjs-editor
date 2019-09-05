import ReactDOM from 'react-dom';

const contextItemsElement = document.getElementById('context-items');

const ContextMenuItems = ({ children }) => ReactDOM.createPortal(
  children,
  contextItemsElement,
);

export default ContextMenuItems;
