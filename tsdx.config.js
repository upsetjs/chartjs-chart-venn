const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('rollup-plugin-pnp-resolve');
const cleanup = require('rollup-plugin-cleanup');
const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('./package.json'));

module.exports = {
  rollup(config, options) {
    // if (options.format === 'umd') {
    //   config.input = './src/bundle.ts';
    // }

    // TODO list UMD names of dependencies
    // config.output.globals[''] = '';
    const originalExternal = config.external;
    const external = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.peerDependencies || {}));
    config.external = (v) => (originalExternal(v) ? external.includes(v) : false);

    const c = config.plugins.findIndex((d) => d.name === 'commonjs');
    if (c !== -1) {
      config.plugins.splice(c, 1);
    }
    config.plugins.splice(0, 0, resolve(), commonjs());
    config.plugins.push(
      cleanup({
        comments: ['some', 'ts', 'ts3s'],
        extensions: ['ts', 'tsx', 'js', 'jsx'],
      })
    );
    config.output.banner = `/**
 * ts-library-template
 * https://github.com/sgratzl/ts-library-template
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */`;
    return config;
  },
};
