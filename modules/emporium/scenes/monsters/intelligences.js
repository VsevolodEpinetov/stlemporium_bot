const { Scenes, Markup } = require("telegraf");
const util = require('../../../util.js');
const emporiumUtils = require('../../util.js')

const nextStageName = 'SIZES';
const thisStageName = 'INTELLIGENCES';
const endpoint = 'monster-intelligences';

const monsterIntelligencesStage = new Scenes.BaseScene(thisStageName);

monsterIntelligencesStage.enter(async (ctx) => {
  const dataFromApi = await emporiumUtils.getDataFromApi(endpoint); 
  ctx.session.data = dataFromApi;
  ctx.replyWithHTML(`Записал указанные тобой данные.\nНапиши оружие, которое держит существо.\n\nДоступные:${dataFromApi.map(w => `\n<code>${w},</code>`).join('')}`, {
    parse_mode: 'HTML'
  }).then(nctx => {
    ctx.session.emporium.botData.lastMessage.bot = nctx.message_id;
  })
});

monsterIntelligencesStage.command('exit', (ctx) => {
  util.log(ctx)
  ctx.reply('Вышел')
  ctx.scene.leave();
})

monsterIntelligencesStage.on('message', (ctx) => {
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
    ctx.reply('Указанные тобой типы не существуют на сайте'); // Respond if no valid races are found
    ctx.scene.enter(thisStageName);
  } else {
    ctx.session.emporium.creatureData.monsterIntelligences = validData;
     ctx.scene.enter(nextStageName);
  }
});


monsterIntelligencesStage.leave(async (ctx) => {
});

module.exports = monsterIntelligencesStage;