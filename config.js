'use strict';

const DEFAULT_PORT = 4444;
let PORT = process.env['PORT'] || process.env['port'] || DEFAULT_PORT;
try {
  PORT = parseInt(PORT, 10) || DEFAULT_PORT;
} catch (err) {
  PORT = DEFAULT_PORT;
}

const ROOT = __dirname;

module.exports = {
  PORT,
  ROOT,
  TEMPLATES_ROOT: `${ROOT}/templates`,
  JS_ROOT: `${ROOT}/js`,
  CSS_ROOT: `${ROOT}/css`,
};