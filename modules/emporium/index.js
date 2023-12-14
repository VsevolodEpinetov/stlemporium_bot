const { Composer } = require('telegraf')

module.exports = Composer.compose([
  require('./commands/emporium'),
  require('./commands/se'),
  require('./commands/rs'),
  require('./commands/nq'),
  require('./commands/p'),
  require('./commands/test'),
  require('./commands/count'),
  require('./actions/cancel'),
  require('./actions/publish'),
  require('./actions/changeBGAny'),
  require('./actions/changeBGRaces'),
  require('./actions/changeBGExact'),
  require('./actions/changeBGRandom'),
  require('./actions/changeBGClasses'),
  require('./actions/sendToConfirmation'),
])