const { Scenes, Markup } = require("telegraf");
const util = require('../../../util.js');
const emporiumUtils = require('../../util.js')

const nextStageName = 'KINDS';
const thisStageName = 'TYPES';
const endpoint = 'monster-types';

const monsterTypesStage = new Scenes.BaseScene(thisStageName);

monsterTypesStage.enter(async (ctx) => {
  const dataFromApi = await emporiumUtils.getDataFromApi(endpoint); 
  ctx.session.data = dataFromApi;
  ctx.replyWithHTML(`Записал указанные тобой данные. Напиши оружие, которое держит существо.\n\nДоступные:${dataFromApi.map(w => `\n<code>${w},</code>`).join('')}`, {
    parse_mode: 'HTML'
  }).then(nctx => {
    ctx.session.emporium.botData.lastMessage.bot = nctx.message_id;
  })
});

monsterTypesStage.command('exit', (ctx) => {
  util.log(ctx)
  ctx.reply('Вышел')
  ctx.scene.leave();
})

monsterTypesStage.on('message', (ctx) => {
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
    ctx.session.emporium.creatureData.monsterTypes = validData;
     ctx.scene.enter(nextStageName);
  }
});


monsterTypesStage.leave(async (ctx) => {
});

module.exports = monsterTypesStage;