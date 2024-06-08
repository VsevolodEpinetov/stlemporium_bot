const { Scenes, Markup } = require("telegraf");
const util = require('../../../util.js');
const emporiumUtils = require('../../util.js')

const nextStageName = 'PICTURE';
const thisStageName = 'SIZES';
const endpoint = 'monster-sizes';

const monsterSizesStage = new Scenes.BaseScene(thisStageName);

monsterSizesStage.enter(async (ctx) => {
  //const dataFromApi = await emporiumUtils.getDataFromApi(endpoint); 
  const dataFromApi = ['tiny', 'small', 'medium', 'big', 'huge', 'gargantuan']
  ctx.session.data = dataFromApi;
  ctx.replyWithHTML(`Записал указанные тобой данные. Напиши оружие, которое держит существо.\n\nДоступные:${dataFromApi.map(w => `\n<code>${w},</code>`).join('')}`, {
    parse_mode: 'HTML'
  }).then(nctx => {
    ctx.session.emporium.botData.lastMessage.bot = nctx.message_id;
  })
});

monsterSizesStage.command('exit', (ctx) => {
  util.log(ctx)
  ctx.reply('Вышел')
  ctx.scene.leave();
})

monsterSizesStage.on('message', (ctx) => {
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
    ctx.session.emporium.creatureData.monsterSizes = validData;
     ctx.scene.enter(nextStageName);
  }
});


monsterSizesStage.leave(async (ctx) => {
});

module.exports = monsterSizesStage;