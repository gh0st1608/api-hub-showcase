const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['dist/src/lambda.js'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'bundle/lambda.js',
  minify: true,
  keepNames: true,

  external: [
    '@nestjs/microservices',
    '@nestjs/microservices/*',
    '@nestjs/websockets',
    '@nestjs/websockets/*',
    '@nestjs/mongoose',
    '@nestjs/sequelize',
    '@mikro-orm/core',
    'class-transformer/storage',
  ],
}).catch(() => process.exit(1));