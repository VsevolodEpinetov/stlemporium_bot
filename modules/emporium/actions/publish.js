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
      let crData = "";
      if (!creatureData.isWH) {
        if (creatureData.isHero) {
          crData = {
            data: {
              sex: creatureData.sex,
              classes: creatureData.classes,
              races: creatureData.races,
              mainPicture: imageID,
              priceSTL: 106,
              pricePhysical: 318,
              studioName: creatureData.studioName,
              releaseName: creatureData.releaseName,
              code: creatureData.code,
              onlyPhysical: false,
              weapons: creatureData.weapons
            }
          };
          const result = await emporiumUtils.createACreature(crData, creatureData.isWH);
          const code = ctx.globalSession.emporium.queue[crID].data.code;
          ctx.reply(`Герой с кодом ${code} успешно загружен`)
        }

        if (creatureData.isMonster) {
          crData = {
            data: {
              sex: creatureData.sex,
              races: creatureData.races,
              mainPicture: imageID,
              priceSTL: 106,
              pricePhysical: 318,
              studioName: creatureData.studioName,
              releaseName: creatureData.releaseName,
              code: creatureData.code,
              onlyPhysical: false,
              weapons: creatureData.weapons,
              environments: creatureData.monsterEnvironments,
              intelligence: creatureData.monsterIntelligences,
              kinds: creatureData.monsterKinds,
              size: creatureData.monsterSizes,
              types: creatureData.monsterTypes
            }
          };
          const result = await emporiumUtils.createAMonster(crData);
          const code = ctx.globalSession.emporium.queue[crID].data.code;
          ctx.reply(`Монстр с кодом ${code} успешно загружен`)
        }
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
        const result = await emporiumUtils.createACreature(crData, creatureData.isWH);
        const code = ctx.globalSession.emporium.queue[crID].data.code;
        ctx.reply(`вх40к с кодом ${code} успешно загружен`)
      }
      try {
        ctx.globalSession.emporium.queue[crID].data.preview = undefined;
        if (!ctx.globalSession.uploaders) {
          ctx.globalSession.uploaders = {}
          ctx.globalSession.uploaders[userID] = 0;
        };
        ctx.globalSession.uploaders[userID] = ctx.globalSession.uploaders[userID] + 1;
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