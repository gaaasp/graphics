export default async function request(url) {
	return await fetch(`https://www.${url}`, {
		headers: {
			origin: `https://www.${url.split("/")[0]}`,
			referer: `https://www.${url.split("/")[0]}/`,
		},
	})
		.then((res) => res.text())
		.then((html) => new DOMParser().parseFromString(html, "text/html"));
}
