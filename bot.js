import { Telegraf } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN mancante nelle variabili Render!");
if (!WEBAPP_URL) throw new Error("WEBAPP_URL mancante!");

const bot = new Telegraf(BOT_TOKEN);

// Comando /start
bot.start((ctx) => {
    ctx.reply(
        "Benvenuto! 👟\nPremi il pulsante sotto per aprire il catalogo:",
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "📦 Apri Catalogo",
                            web_app: { url: WEBAPP_URL }
                        }
                    ]
                ]
            }
        }
    );
});

bot.launch();
console.log("Bot su Render avviato con successo!");
