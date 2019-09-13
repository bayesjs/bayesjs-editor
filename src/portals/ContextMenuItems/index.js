import ReactDOM from 'react-dom';

const ContextMenuItems = ({ children }) => ReactDOM.createPortal(
  children,
  document.getElementById('context-items'),
);

export default ContextMenuItems;
