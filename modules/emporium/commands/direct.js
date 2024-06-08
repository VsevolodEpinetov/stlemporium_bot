const { Composer } = require("telegraf");
const SETTINGS = require('../../../settings.json')
const STUDIOS = require('../studios.json')
const util = require('../../util')

module.exports = Composer.command('direct', async (ctx) => {
  util.log(ctx)
  
  
})