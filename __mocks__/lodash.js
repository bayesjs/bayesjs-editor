const lodash = require('lodash');

lodash.throttle = jest.fn(func => func);

module.exports = lodash;
