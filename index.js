import Telegraf from "node-telegram-bot-api";
import Redis from "ioredis";
import { getUpdates } from "./utils/index.js";
import { config } from "dotenv";

config();

const redis = new Redis(process.env.REDIS_URL);
const bot = new Telegraf(process.env.TELEGRAM_TOKEN, { polling: true });

let chats = await redis.get("chats");
chats = chats ? JSON.parse(chats) : [];

bot.onText(/\/start/, (ctx) => {
	bot.sendMessage(ctx.chat.id, "🥳 Joined with success");
	chats = [...chats.filter((chat) => chat !== ctx.chat.id), ctx.chat.id];
	redis.set("chats", JSON.stringify(chats));
});

console.log("🚀 Starting...", JSON.stringify(chats));

const send = async () => {
	const { added, removed } = await getUpdates();
	const messages = [
		...added.map(
			({ name, price, url }) =>
				`✅ ${price?.toLocaleString("fr-FR", {
					style: "currency",
					currency: "EUR",
				})} - ${name}
🔗 ${url}`
		),
		...removed.map(
			({ name, price }) =>
				`❌ ${price?.toLocaleString("fr-FR", {
					style: "currency",
					currency: "EUR",
				})} - ${name}`
		),
	];
	console.log(new Date().toISOString(), messages);
	chats.map((chat) =>
		messages.map((message) => bot.sendMessage(chat, message))
	);
};

send();

setInterval(send, 1000 * 60);
