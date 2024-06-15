/// <reference types="vitest"/>
const { defineConfig } = require('vite');

defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.spec.ts'],
    dir: 'src/test',
  },
});

module.exports = defineConfig();
