const { Scenes, Markup } = require("telegraf");
const util = require('../../util.js');
const emporiumUtils = require('../util.js')

const nextStageName = 'WEAPONS'
const thisStageName = 'RACES';
const endpoint = 'races';

const emporiumRacesStage = new Scenes.BaseScene(thisStageName);

emporiumRacesStage.enter(async (ctx) => {
  const dataFromApi = await emporiumUtils.getDataFromApi(endpoint);
  ctx.session.data = dataFromApi;
  ctx.replyWithHTML(`Так и запишем - ${ctx.session.emporium.creatureData.sex}. Напиши расы существа.\n\nДоступные:${dataFromApi.map(r => `\n<code>${r},</code>`).join('')}\n\nПресеты:\n<code>half-elf,</code><code>human,</code><code>half-orc,</code>\n<code>dwarf,</code><code>gnome,</code><code>halfling,</code>`, {
    parse_mode: 'HTML'
  }).then(nctx => {
    ctx.session.emporium.botData.lastMessage.bot = nctx.message_id;
  })
});

emporiumRacesStage.command('exit', (ctx) => {
  util.log(ctx)
  ctx.reply('Вышел')
  ctx.scene.leave();
})

emporiumRacesStage.on('message', (ctx) => {
  const userData = ctx.message.text.replace(/\s/g, '');
  const userDataArray = userData.split(',').filter((item) => item !== '');
  const validData = userDataArray.filter((d) => ctx.session.data.includes(d));

  try {
    ctx.deleteMessage(ctx.session.emporium.botData.lastMessage.bot);
  }
  catch (err) {
    console.log(err);
  }

  if (validData.length === 0) {
    ctx.reply('Указанные тобой данные не существуют на сайте'); // Respond if no valid races are found
    ctx.scene.enter(thisStageName);
  } else {
    ctx.session.emporium.creatureData.races = validData;
    ctx.scene.enter(nextStageName);
  }
})

emporiumRacesStage.leave(async (ctx) => {
});

module.exports = emporiumRacesStage;