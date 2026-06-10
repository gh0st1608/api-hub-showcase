import { RuleConfigSeverity } from '@commitlint/types';

const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce lowercase type (feat, fix, chore, …)
    'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],

    // Allowed types — extend this list as your team agrees
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation changes
        'style',    // Formatting, no logic change
        'refactor', // Code restructuring, no feat/fix
        'perf',     // Performance improvement
        'test',     // Adding or updating tests
        'build',    // Build system or deps (e.g. npm, Dockerfile)
        'ci',       // CI configuration changes
        'chore',    // Maintenance tasks
        'revert',   // Reverts a previous commit
      ],
    ],

    // Subject line must not end with a period
    'subject-full-stop': [RuleConfigSeverity.Error, 'never', '.'],

    // Subject must start with a lowercase letter (no capital)
    'subject-case': [
      RuleConfigSeverity.Error,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],

    // Max length for subject line (GitHub truncates at 72)
    'header-max-length': [RuleConfigSeverity.Error, 'always', 100],

    // Body and footer lines max length
    'body-max-line-length': [RuleConfigSeverity.Warning, 'always', 100],
    'footer-max-line-length': [RuleConfigSeverity.Warning, 'always', 100],
  },
};

export default config;
