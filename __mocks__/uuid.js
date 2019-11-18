const uuid = require('uuid');

module.exports = {
  ...uuid,
  v4: jest.fn(() => '9314dbfe-d3ba-48c2-8948-0555806dc4d0'),
};
