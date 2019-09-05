module.exports = {
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.[jt]sx?$',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
    '^components(.*)$': '<rootDir>/src/components$1',
    '^utils(.*)$': '<rootDir>/src/utils$1',
    '^models(.*)$': '<rootDir>/src/models$1',
    '^reducers(.*)$': '<rootDir>/src/reducers$1',
    '^selectors(.*)$': '<rootDir>/src/selectors$1',
    '^actions(.*)$': '<rootDir>/src/actions$1',
    '^decorators(.*)$': '<rootDir>/src/decorators$1',
    '^constants(.*)$': '<rootDir>/src/constants$1',
    '^validations(.*)$': '<rootDir>/src/validations$1',
    '^portals(.*)$': '<rootDir>/src/portals$1',
  },
};
