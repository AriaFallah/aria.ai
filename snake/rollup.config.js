import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/Index.bs.js',
  output: {
    file: 'dist/snake.js',
    format: 'iife',
    name: 'bundle',
  },
  plugins: [resolve(), uglify()],
};
