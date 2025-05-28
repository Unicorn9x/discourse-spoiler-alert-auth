'use strict';

const { build } = require('@embroider/webpack');
const { compatBuild } = require('@embroider/compat');

module.exports = function (defaults) {
  let app = compatBuild(build(defaults), {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticComponents: true,
    skipBabel: [
      {
        package: 'some-inline-addon'
      }
    ]
  });

  return app.toTree();
}; 