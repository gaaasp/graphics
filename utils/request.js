import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";
import { JSDOM } from "jsdom";

export default async function request(url) {
	return await api(url)
		.then((res) => res.text())
		.then((html) => new JSDOM(html).window.document);
}

export async function api(url, { headers = {}, ...config } = {}) {
	const proxies = [
		//"51.81.80.170",
		//"51.195.91.5",
		//"151.80.155.24",
		"151.80.155.220",
		"51.79.249.253",
		"51.79.249.252",
		"51.79.160.79",
	];
	return await fetch(`https://www.${url}`, {
		headers: {
			origin: `https://www.${url.split("/")[0]}`,
			referer: `https://www.${url.split("/")[0]}/${config.referer || ""}`,
			...headers,
		},
		agent: new HttpsProxyAgent(
			`http://${proxies[Math.floor(Math.random() * proxies.length)]}:8080`
		),
		...config,
	});
}
