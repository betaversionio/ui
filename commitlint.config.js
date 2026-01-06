module.exports = {
  extends: ['gitmoji'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 200],
    'subject-empty': [0],
    'type-empty': [0],
    'subject-case': [0],
    'header-case': [0],
    'type-enum': [0],  // Disable type enum check - gitmoji handles this
  },
};
