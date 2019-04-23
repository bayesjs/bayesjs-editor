import { isFunction, isNil } from 'lodash';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { map } from 'ramda';

const statify = mapStateToProps =>
  isNil(mapStateToProps)
    ? mapStateToProps
    : (state, ownProps) =>
      map(
        selector => selector(state, ownProps),
        isFunction(mapStateToProps) ? mapStateToProps(ownProps) : mapStateToProps,
      );

const dispatchify = mapDispatchToProps =>
  isFunction(mapDispatchToProps)
    ? (dispatch, ownProps) => bindActionCreators(mapDispatchToProps(ownProps), dispatch)
    : mapDispatchToProps;

const connectify = (mapStateToProps, mapDispatchToProps, ...args) =>
  connect(statify(mapStateToProps), dispatchify(mapDispatchToProps), ...args);

export default connectify;
