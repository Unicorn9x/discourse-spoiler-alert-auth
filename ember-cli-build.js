"use strict";

const { build } = require("@embroider/compat");

module.exports = function (defaults) {
  return build(defaults, {
    staticAddonTrees: true,
    staticAddonTestSupportTrees: true,
    staticHelpers: true,
    staticComponents: true,
    skipBabel: [
      {
        package: "qunit",
      },
    ],
  });
}; 