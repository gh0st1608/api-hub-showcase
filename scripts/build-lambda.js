const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['dist/src/lambda.js'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'bundle/lambda.js',
  minify: true,
  sourcemap: false,
  external: [],
}).catch(() => process.exit(1));