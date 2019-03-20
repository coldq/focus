const getOptions = require('loader-utils').getOptions
const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    author: {
      type: 'string'
    }
  }
};
module.exports = function(source) {
    const options = getOptions(this);
    validateOptions(schema, options, 'Sign Loader');
    
    return `//@${options.author}牛逼 \n ${source}`;
}