import { Telegraf } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN mancante!");
  process.exit(1);
}

if (!WEBAPP_URL) {
  console.error("❌ WEBAPP_URL mancante!");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Benvenuto!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📦 Apri Catalogo",
            web_app: { url: WEBAPP_URL },
          },
        ],
      ],
    },
  });
});

bot.launch();

console.log("✅ BOT AVVIATO");

