// bot.js
import express from "express";
import { Telegraf } from "telegraf";
import { supabase } from "./supabase.js";

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// URL pubblico di Render per questo servizio
// Se cambi nome al servizio, cambia anche questo:
const BASE_URL = "https://telegram-webapp-bot-crnn.onrender.com";

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN mancante nelle env di Render");
  process.exit(1);
}
if (!WEBAPP_URL) {
  console.error("❌ WEBAPP_URL mancante nelle env di Render");
  process.exit(1);
}
if (!ADMIN_PASSWORD) {
  console.error("❌ ADMIN_PASSWORD mancante nelle env di Render");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// funzione per loggare l’utente su Supabase
async function logUser(ctx, source = "start") {
  try {
    const u = ctx.from || {};
    const insert = {
      telegram_id: u.id?.toString() || null,
      username: u.username || null,
      first_name: u.first_name || null,
      last_name: u.last_name || null,
      language: u.language_code || null,
      source,
      created_at: new Date().toISOString()
    };

    await supabase.from("webapp_visits").insert(insert);
  } catch (err) {
    console.error("Errore salvataggio Supabase:", err.message);
  }
}

// /start → pulsante WebApp + logging
bot.start(async (ctx) => {
  await logUser(ctx, "start");

  await ctx.reply(
    "Benvenuto! 👋\nPremi il pulsante sotto per aprire il catalogo:",
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

// comando /admin per te (controllo semplice con password)
bot.command("admin", async (ctx) => {
  const text = ctx.message.text || "";
  const parts = text.split(" ");
  const pass = parts[1];

  if (pass !== ADMIN_PASSWORD) {
    return ctx.reply("❌ Accesso admin negato.");
  }

  await ctx.reply(
    "✅ Accesso admin ok.\n\nLink diretto WebApp (bypass Telegram):\n" +
    WEBAPP_URL
  );
});

const app = express();
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("Bot attivo ✅");
});

// Path segreto per webhook (include il token per semplicità)
const secretPath = `/telegram-webhook/${BOT_TOKEN}`;

// Colleghiamo Telegraf a Express
app.use(secretPath, (req, res) => {
  bot.webhookCallback(secretPath)(req, res);
});

// Avvio server + setWebhook
const PORT = process.env.PORT || 10000;

app.listen(PORT, async () => {
  console.log(`🚀 Server in ascolto sulla porta ${PORT}`);

  const webhookUrl = `${BASE_URL}${secretPath}`;
  try {
    await bot.telegram.setWebhook(webhookUrl);
    console.log("✅ Webhook impostato:", webhookUrl);
  } catch (err) {
    console.error("❌ Errore setWebhook:", err.message);
  }
});
