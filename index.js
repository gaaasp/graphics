const Telegraf = require("telegraf");
import Redis from "ioredis";
import { getUpdates } from "./utils";

const redis = new Redis(process.env.REDIS_URL);
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

let chats = await redis.get("chats");
chats = chats ? JSON.stringify(chats) : [];

bot.command("start", (ctx) => {
	chats = [...chats.filter((chat) => chat !== ctx.chat.id), ctx.chat.id];
	redis.set("chats", JSON.stringify(chats));
});

setInterval(async () => {
	const { added, removed } = await getUpdates();
	const messages = [
		...added.map(
			({ name, price, url }) =>
				`${price?.toLocaleString("fr-FR", {
					style: "currency",
					currency: "EUR",
				})} - ${name}
${url}`
		),
		...removed.map(
			({ name, price }) =>
				`${price?.toLocaleString("fr-FR", {
					style: "currency",
					currency: "EUR",
				})} - ${name}`
		),
	];
	chats.map((chat) =>
		messages.map((message) => bot.telegram.sendMessage(chat, message))
	);
}, 1000 * 60);
