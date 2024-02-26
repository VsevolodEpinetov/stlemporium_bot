const { Scenes, Markup } = require("telegraf");
const util = require('../../../util.js');
const emporiumUtils = require('../../util.js')

const nextStageName = 'INTELLIGENCES';
const thisStageName = 'KINDS';
const endpoint = 'monster-kinds';

const monsterKindsStage = new Scenes.BaseScene(thisStageName);

monsterKindsStage.enter(async (ctx) => {
  const dataFromApi = await emporiumUtils.getDataFromApi(endpoint); 
  ctx.session.data = dataFromApi;
  ctx.replyWithHTML(`Записал указанные тобой данные. Напиши оружие, которое держит существо.\n\nДоступные:${dataFromApi.map(w => `\n<code>${w},</code>`).join('')}`, {
    parse_mode: 'HTML'
  }).then(nctx => {
    ctx.session.emporium.botData.lastMessage.bot = nctx.message_id;
  })
});

monsterKindsStage.command('exit', (ctx) => {
  util.log(ctx)
  ctx.reply('Вышел')
  ctx.scene.leave();
})

monsterKindsStage.on('message', (ctx) => {
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
    ctx.session.emporium.creatureData.monsterKinds = validData;
     ctx.scene.enter(nextStageName);
  }
});


monsterKindsStage.leave(async (ctx) => {
});

module.exports = monsterKindsStage;