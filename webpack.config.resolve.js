const path = require('path');

module.exports = {
  modules: ['node_modules', path.resolve(__dirname)],
  extensions: ['.js', '.jsx', '.json', '.scss'],
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
    utils: path.resolve(__dirname, 'src/utils/'),
    models: path.resolve(__dirname, 'src/models/'),
    reducers: path.resolve(__dirname, 'src/reducers/'),
    selectors: path.resolve(__dirname, 'src/selectors/'),
    actions: path.resolve(__dirname, 'src/actions/'),
  },
};
