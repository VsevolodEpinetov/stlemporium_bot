//#region imports
const { Telegraf, Markup, Telegram, Scenes, session } = require('telegraf');
const { telegrafThrottler } = require('telegraf-throttler');
require('dotenv').config();
const bot = new Telegraf(process.env.TOKEN)
const throttler = telegrafThrottler();
bot.use(throttler);
const telegram = new Telegram(process.env.TOKEN)
const SETTINGS = require('./settings.json')

const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');

const util = require('./modules/util.js');
//#endregion

//#region Redis
// --------------------------------------------------------------------------
// 1. Redis, sessions
// --------------------------------------------------------------------------
const RedisSession = require('telegraf-session-redis-upd')
const sessionInstance = new RedisSession();
const SESSIONS = require('./modules/sessions.js');
const { default: axios } = require('axios');
bot.use(
  SESSIONS.GLOBAL_SESSION,
  SESSIONS.CHANNELS_SESSION,
  SESSIONS.USER_SESSION,
  SESSIONS.CHAT_SESSION
)
//#endregion



const replyToTheMessage = (ctx, message, replyToID) => {
  ctx.replyWithHTML(message, {
    reply_to_message_id: replyToID
  }).catch((error) => {
    console.log("Error! Couldn't reply to a message, just sending a message. Reason:")
    console.log(error)
    ctx.replyWithHTML(message)
  })
}

//#region Register Scenes, Init Stage
const stage = new Scenes.Stage([
  require('./modules/emporium/scenes/type'),
  require('./modules/emporium/scenes/classes'),
  require('./modules/emporium/scenes/races'),
  require('./modules/emporium/scenes/releaseName'),
  require('./modules/emporium/scenes/sex'),
  require('./modules/emporium/scenes/studioName'),
  require('./modules/emporium/scenes/weapons'),
  require('./modules/emporium/scenes/photo'),
  require('./modules/emporium/scenes/photoExact'),
  require('./modules/emporium/scenes/whFactions'),
  require('./modules/emporium/scenes/whType'),
]);
bot.use(session());
bot.use(stage.middleware());

bot.use(require('./modules/commands'))
bot.use(require('./modules/emporium'))
//#endregion

bot.catch((error) => {
  console.log(error);
})

// --------------------------------------------------------------------------
// 4. Service
// --------------------------------------------------------------------------
bot.launch()
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))