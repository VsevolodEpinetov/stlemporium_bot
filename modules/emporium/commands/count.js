const { Composer } = require("telegraf");
const SETTINGS = require('../../../settings.json')
const STUDIOS = require('../studios.json')
const util = require('../../util')

module.exports = Composer.command('count', async (ctx) => {
  util.log(ctx)
  
  const userID = ctx.message.reply_to_message.from.id;
  ctx.reply(`Всего загружено: ${ctx.globalSession.uploaders[userID]}`)
})