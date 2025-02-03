import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'

const packageJson = require('./package.json')

export default {
  input: 'src/index.ts',
  external: ['react', 'react-dom', 'styled-components'],
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      clean: true, // Ensures cache is cleaned every time
      cacheRoot: undefined, // Prevent cache from being created
    }),
    postcss({
      extensions: ['.css'],
    }),
  ],
}
