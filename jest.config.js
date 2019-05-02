module.exports = {
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.[jt]sx?$',
  setupTestFrameworkScriptFile: '<rootDir>/jest.setup.js',
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    '^components(.*)$': '<rootDir>/src/components$1',
    '^utils(.*)$': '<rootDir>/src/utils$1',
    '^models(.*)$': '<rootDir>/src/models$1',
    '^reducers(.*)$': '<rootDir>/src/reducers$1',
    '^selectors(.*)$': '<rootDir>/src/selectors$1',
    '^actions(.*)$': '<rootDir>/src/actions$1',
    '^decorators(.*)$': '<rootDir>/src/decorators$1',
    '^constants(.*)$': '<rootDir>/src/constants$1',
  },
};
