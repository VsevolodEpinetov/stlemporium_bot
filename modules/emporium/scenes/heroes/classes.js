const { Scenes, Markup } = require("telegraf");
const SETTINGS = require('../../../../settings.json');
const util = require('../../../util.js');
const emporiumUtils = require('../../util.js')
const { default: axios } = require("axios");

const nextStageName = 'PICTURE';
const nextStageNameMonster = 'ENVIRONMENTS';
const thisStageName = 'CLASSES';
const endpoint = 'classes';

const emporiumClassesStage = new Scenes.BaseScene(thisStageName);

emporiumClassesStage.enter(async (ctx) => {
  const dataFromApi = await emporiumUtils.getDataFromApi(endpoint); 
  ctx.session.data = dataFromApi;
  ctx.replyWithHTML(`Записал указанные тобой данные\nНапиши классы существа.\n\nДоступные:${dataFromApi.map(w => `\n<code>${w},</code>`).join('')}\n\nПресеты для героев:\n<code>warlock,</code><code>sorcerer,</code><code>wizard,</code>\n<code>fighter,</code><code>gladiator,</code><code>paladin,</code>`, {
    parse_mode: 'HTML'
  }).then(nctx => {
    ctx.session.emporium.botData.lastMessage.bot = nctx.message_id;
  })
});

emporiumClassesStage.command('exit', (ctx) => {
  util.log(ctx)
  ctx.reply('Вышел')
  ctx.scene.leave();
})

emporiumClassesStage.on('message', (ctx) => {
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
    ctx.reply('Указанные тобой классы не существуют на сайте.');
    ctx.scene.enter(thisStageName);
  } else {
    ctx.session.emporium.creatureData.classes = validData;

    if (ctx.session.emporium.creatureData.isMonster) {
      // if it is a monster we should also follow the monster path
      ctx.scene.enter(nextStageNameMonster);
    } else {
      // otherwise straight to the exit
      ctx.scene.enter(nextStageName);
    }
  }
});


emporiumClassesStage.leave(async (ctx) => {
});

module.exports = emporiumClassesStage;