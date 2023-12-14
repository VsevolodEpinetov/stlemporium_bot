const { Composer, Markup } = require("telegraf");
const SETTINGS = require('../../../settings.json')
const util = require('../../util')
const emporiumUtils = require('../util.js')

module.exports = Composer.action(/^action-emporium-publish-[0-9]+$/g, async ctx => {
  util.log(ctx)

  const crID = ctx.callbackQuery.data.split('action-emporium-publish-')[1];

  if (ctx.globalSession.emporium.queue[crID]) {
    const userID = ctx.callbackQuery.from.id;
    const queueData = ctx.globalSession.emporium.queue[crID];
    const creatureData = queueData.data;
    const isWaiting = queueData.status === 'waiting';

    if (isWaiting) {
      const fileName = `${creatureData.code}.png`;
      const imageID = await emporiumUtils.uploadImage(ctx, creatureData.preview.buffer, fileName);
      let crData;
      if (!creatureData.isWH) {
        crData = {
          data: {
            sex: creatureData.sex,
            classes: creatureData.classes,
            races: creatureData.races,
            mainPicture: imageID,
            priceSTL: 106,
            pricePhysical: 318,
            priceCyprus: 4,
            studioName: creatureData.studioName,
            releaseName: creatureData.releaseName,
            code: creatureData.code,
            onlyPhysical: false,
            isMonster: creatureData.isMonster,
            isHero: creatureData.isHero,
            weapons: creatureData.weapons
          }
        };
      } else {
        crData = {
          data: {
            mainPicture: imageID,
            priceSTL: 106,
            pricePhysical: 312,
            priceCyprus: 4,
            studioName: creatureData.studioName,
            releaseName: creatureData.releaseName,
            code: creatureData.code,
            onlyPhysical: false,
            factions: creatureData.factions,
            type: creatureData.whTypes
          }
        };
      }
      try {
        const result = await emporiumUtils.createACreature(crData, creatureData.isWH);
        const code = ctx.globalSession.emporium.queue[crID].data.code;
        ctx.globalSession.emporium.queue[crID].data.preview = undefined;
        if (!ctx.globalSession.uploaders) {
          ctx.globalSession.uploaders = {}
          ctx.globalSession.uploaders[userID] = 0;
        };
        ctx.globalSession.uploaders[userID] = ctx.globalSession.uploaders[userID] + 1;
        ctx.reply(`Минька с кодом ${code} успешно загружена`)
      } catch (error) {
        console.log('Error!');
      }
      try {
        ctx.deleteMessage(queueData.lastBotMessageId);
      } catch (e) {
        console.log(e);
        ctx.reply('Не получилось удалить сообщение, сделай это вручную');
      }
    } else {
      ctx.answerCbQuery('Уже опубликовано')
    }
  } else {
    ctx.answerCbQuery('Нет такого в бд')
  }
})