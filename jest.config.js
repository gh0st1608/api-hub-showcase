module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: ".",

  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/domain/constants.ts',
    '!src/setup.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/*.dto.ts'
  ],

  /*setupFiles: [
    './test/setEnvVars.ts'
  ],*/

  testMatch: [
    "**/test/**/*.steps.ts", // Archivos de pruebas BDD (jest-cucumber)
    "**/test/**/*.test.ts",  // Archivos unitarios terminados en .test.ts
    "**/test/**/*.spec.ts",  // Archivos unitarios terminados en .spec.ts
    "**/test/**/*.e2e-spec.ts",  // Archivos end to end .e2s-spec.ts
  ],

  coveragePathIgnorePatterns: [
    "/node_modules/",
  ],
  
  coverageDirectory: "./coverage",
  verbose: true, // Muestra detalles de los tests en consola

  transform: {
    "^.+\\.(ts|tsx|js)$": "ts-jest",
  },

  // jose is ESM-only — tell Jest to transform it through ts-jest instead of
  // leaving it untouched (default behaviour for node_modules).
  transformIgnorePatterns: [
    'node_modules/(?!(jose)/)',
  ],

  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@app/(.*)$': '<rootDir>/src/$1',
  },
};
