"use strict";

const { build } = require("@embroider/compat");

module.exports = function (defaults) {
  return build(defaults, {
    staticAddonTrees: true,
    staticAddonTestSupportTrees: true,
    staticHelpers: true,
    staticComponents: true,
    staticModifiers: true,
    staticEmberSource: true,
    skipBabel: [
      {
        package: "qunit",
      },
    ],
  });
}; 