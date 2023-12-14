const { Composer, Markup } = require("telegraf");
const SETTINGS = require('../../../settings.json')
const util = require('../../util')
const emporiumUtils = require('../util.js')

module.exports = Composer.action(/^action-emporium-cancel-[0-9]+$/g, async ctx => {
  util.log(ctx)

  const crID = ctx.callbackQuery.data.split('action-emporium-cancel-')[1];

  if (ctx.globalSession.emporium.queue[crID]) {
    try {
      ctx.deleteMessage(ctx.globalSession.emporium.queue[crID].lastBotMessageId);
      ctx.globalSession.emporium.queue[crID].data = undefined;
      ctx.reply('Отменено!')
    } catch (e) {
      console.log(e);
      ctx.globalSession.emporium.queue[crID].data = undefined;
      ctx.reply('Не получилось удалить сообщение, сделай это вручную, а вот данные стёр');
    }

  } else {
    ctx.answerCbQuery('Нет такого в бд')
  }
})