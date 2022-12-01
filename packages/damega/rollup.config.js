import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    commonjs({
      exclude: [
        '../../node_modules/obniz/dist/src/obniz/libs/webpackReplace/**',
      ],
    }),
    typescript(),
  ],
};
