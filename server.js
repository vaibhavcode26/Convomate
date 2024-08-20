// import { Telegraf } from "telegraf";
const { Telegraf } = require("telegraf");
const {message} = require('telegraf/filters')
require("dotenv").config();
const  userModel  = require("./src/models/user.js");
const connectDB = require('./src/config/db.js')
const eventModel = require('./src/models/Events.js')

const bot = new Telegraf(process.env.TELEGRAM_BOT_API);

try {
    connectDB()
    console.log("Database Connected Successfully")
} catch (error) {
    console.log(error)
    process.kill(process.pid , 'SIGTERM')
}


bot.start(async (ctx) => {
  const from = ctx.update.message.from;
  try {
    await userModel.findOneAndUpdate(
      { tgId: from.id },
      {
        $setOnInsert: {
          firstName: from.first_name,
          lastName: from.last_name,
          isBot: from.is_bot,
          username: from.username,
        },
      },
      { upsert: true, new: true }
    );
    await ctx.reply(
      `Hey! ${from.first_name}, Welcome I will be writing Highly engaging Social Media Posts for You. Just Keep feeding me with the events throught the day. Lets Shine on Social Media`
    );
  } catch (error) {
    console.log(error);
  await ctx.reply("Facing Difficulties")
  }
  
});

bot.command('generate' , async(ctx) => {

    const from = ctx.update.message.from

    const startOfDay = new Date()
    startOfDay.setHours(0,0,0,0)

    const endOfDay = new Date()
    endOfDay.setHours(23,59,59,999)

    const events = await eventModel.find({
        tgId : from.id,
        createdAt : {
            $gte : startOfDay,
            $lte : endOfDay
        }
    })

    if(events.length === 0){
        ctx.reply("No events")
        retrun;
    }

    await ctx.reply("Doing things ....")
})

bot.on(message('text') , async (ctx)=>{
    const from  = ctx.update.message.from
    const message = ctx.update.message.text
    try {
        eventModel.create({
            text : message,
            tgId : from.id
        })
        ctx.reply(
            "Noted! Just keep sending me Your thoughts. To Generate the Posts just enter the command: /generate "
        )
    } catch (error) {
        console.log(error)
        ctx.reply(
            "Facing Difficulties"
        )
    }
    
})





bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
