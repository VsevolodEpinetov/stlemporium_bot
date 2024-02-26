const { Scenes, Markup } = require("telegraf");
const SETTINGS = require('../../../settings.json');
const util = require('../../util.js');
const emporiumUtils = require('../util.js')

const nextStageNameHero = 'CLASSES';
const nextStageNameMonster = 'ENVIRONMENTS';
const thisStageName = 'WEAPONS';
const endpoint = 'weapons';

const emporiumWeaponsStage = new Scenes.BaseScene(thisStageName);

emporiumWeaponsStage.enter(async (ctx) => {
  const dataFromApi = await emporiumUtils.getDataFromApi(endpoint);
  ctx.session.data = dataFromApi;
  ctx.replyWithHTML(`Записал указанные тобой расы:${ctx.session.emporium.creatureData.races.map(r => `${r} `).join(' ')}\n. Напиши оружие, которое держит существо.\n\nДоступные:${dataFromApi.map(w => `\n<code>${w},</code>`).join('')}`, {
    parse_mode: 'HTML'
  }).then(nctx => {
    ctx.session.emporium.botData.lastMessage.bot = nctx.message_id;
  })
});

emporiumWeaponsStage.command('exit', (ctx) => {
  util.log(ctx)
  ctx.reply('Вышел')
  ctx.scene.leave();
})

emporiumWeaponsStage.on('message', (ctx) => {
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
    ctx.reply('Указанное тобой оружие не существует на сайте'); // Respond if no valid races are found
    ctx.scene.enter(thisStageName);
  } else {
    ctx.session.emporium.creatureData.weapons = validData;
    if (ctx.session.emporium.creatureData.isHero) {
      // if hero then first follow the hero path
      ctx.scene.enter(nextStageNameHero);
    } else {
      // otherwise first follow the monster path
      ctx.scene.enter(nextStageNameMonster);
    }
  }
});


emporiumWeaponsStage.leave(async (ctx) => {
});

module.exports = emporiumWeaponsStage;