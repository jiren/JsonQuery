
require('./runner')({
  example: 'client-server',
  task: 'jslint:client',
  errors: 1
});

require('./runner')({
  example: 'client-server',
  task: 'jslint:server',
  errors: 4
});
