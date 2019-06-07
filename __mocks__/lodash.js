const lodash = require('lodash');

module.exports = {
  ...lodash,
  throttle: jest.fn(fn => fn),
};
