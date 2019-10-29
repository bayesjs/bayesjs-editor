const path = require('path');

module.exports = {
  modules: ['node_modules', path.resolve(__dirname)],
  extensions: ['.js', '.jsx', '.json', '.scss'],
  alias: {
    'json-templates': path.resolve(__dirname, '__fixtures__/'),
    components: path.resolve(__dirname, 'src/components/'),
    utils: path.resolve(__dirname, 'src/utils/'),
    models: path.resolve(__dirname, 'src/models/'),
    reducers: path.resolve(__dirname, 'src/reducers/'),
    selectors: path.resolve(__dirname, 'src/selectors/'),
    actions: path.resolve(__dirname, 'src/actions/'),
    decorators: path.resolve(__dirname, 'src/decorators/'),
    constants: path.resolve(__dirname, 'src/constants/'),
    validations: path.resolve(__dirname, 'src/validations/'),
    portals: path.resolve(__dirname, 'src/portals/'),
  },
};
