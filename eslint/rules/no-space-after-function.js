//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  'use strict';

  function detectSpaceAfterFunction(node) {

    var src = context.getSource(node),
        line = src ? src.split('\n')[0] : null;

    if (line && line.match(/function\s/)) {
      context.report(node, 'Empty space after \'function\' keyword is not allowed');
    }

  }

  return {
    'FunctionExpression': detectSpaceAfterFunction
  };

};