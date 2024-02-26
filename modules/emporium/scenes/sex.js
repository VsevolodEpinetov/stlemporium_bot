const { Scenes, Markup } = require("telegraf");
const SETTINGS = require('../../../settings.json');
const util = require('../../util.js')

const emporiumSexStage = new Scenes.BaseScene('SEX');
const nextStageName = 'RACES'

emporiumSexStage.enter((ctx) => {
  ctx.replyWithHTML(`Ага, название релиза -  "${ctx.session.emporium.creatureData.releaseName}", код миниатюрки: ${ctx.session.emporium.creatureData.code}. Укажи предполагаемый пол существа`, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      Markup.button.callback('👨‍🦱 Муж.', 'actionEmporiumMale'),
      Markup.button.callback('👩 Жен.', 'actionEmporiumFemale'),
      Markup.button.callback('👽 хз', 'actionEmporiumAlien')
    ])
  }).then(nctx => {
    ctx.session.emporium.botData.lastMessage.bot = nctx.message_id;
  })
});

emporiumSexStage.command('exit', (ctx) => {
  util.log(ctx)
  ctx.reply('Вышел')
  ctx.scene.leave();
})

emporiumSexStage.on('message', (ctx) => {
  ctx.reply('Выбери вариант из сообщения выше')
})

emporiumSexStage.action('actionEmporiumMale', ctx => {
  ctx.session.emporium.creatureData.sex = 'm';
  try {
    ctx.deleteMessage(ctx.session.emporium.botData.lastMessage.bot);
  }
  catch (err) {
    console.log(err);
  }
  ctx.scene.enter(nextStageName)
})

emporiumSexStage.action('actionEmporiumFemale', ctx => {
  ctx.session.emporium.creatureData.sex = 'f';
  try {
    ctx.deleteMessage(ctx.session.emporium.botData.lastMessage.bot);
  }
  catch (err) {
    console.log(err);
  }
  ctx.scene.enter(nextStageName)
})

emporiumSexStage.action('actionEmporiumAlien', ctx => {
  ctx.session.emporium.creatureData.sex = 'x';
  try {
    ctx.deleteMessage(ctx.session.emporium.botData.lastMessage.bot);
  }
  catch (err) {
    console.log(err);
  }
  ctx.scene.enter(nextStageName)
})


emporiumSexStage.leave(async (ctx) => {
});

module.exports = emporiumSexStage;