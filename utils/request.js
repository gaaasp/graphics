const fetch = require("undici-fetch");
import { JSDOM } from "jsdom";

export default async function request(url) {
	return await fetch(`https://www.${url}`, {
		headers: {
			origin: `https://www.${url.split("/")[0]}`,
			referer: `https://www.${url.split("/")[0]}/`,
		},
	})
		.then((res) => res.text())
		.then((html) => new JSDOM(html).window.document);
}
