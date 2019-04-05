import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

class RenderIntoBody extends Component {
  componentDidMount() {
    const { children } = this.props;
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    ReactDOM.render(children, this.container);
  }

  componentDidUpdate() {
    const { children } = this.props;
    ReactDOM.render(children, this.container);
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.container);
    document.body.removeChild(this.container);
  }

  render() {
    return null;
  }
}

RenderIntoBody.propTypes = {
  children: PropTypes.element.isRequired,
};

export default RenderIntoBody;
