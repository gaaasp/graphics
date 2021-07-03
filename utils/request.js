const fetch = require("node-fetch");
import { JSDOM } from "jsdom";

export default async function request(url) {
	return await api(url)
		.then((res) => res.text())
		.then((html) => new JSDOM(html).window.document);
}

export async function api(url, { headers = {}, ...config } = {}) {
	return await fetch(`https://www.${url}`, {
		headers: {
			origin: `https://www.${url.split("/")[0]}`,
			referer: `https://www.${url.split("/")[0]}/${config.referer || ""}`,
			...headers,
		},
		...config,
	});
}
