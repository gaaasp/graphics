import { pages } from "../utils/index.js";

export default async function getGraphicCards() {
	return await pages(
		(doc) => [
			doc ? JSON.parse(
				Array.from(doc.querySelector("head").children)
					.find((item) =>
						item.textContent
							.replace("\n", "")
							.replace(/ /g, "")
							.startsWith("dataLayer=")
					)
					.textContent.split("dataLayer.push(")[1]
					.slice(0, -3)
					.replace(/\\n/g, "")
					.replace(/'/g, '"')
			).ecommerce.impressions.map(({ id, name, price }) => ({
				name,
				price: parseFloat(price),
				url: `https://www.ldlc.com${
					doc.querySelector(
						`#pdt-${id} > div.dsp-cell-right > div.pdt-info > div.pdt-desc > h3 > a`
					).href
				}`,
				site: "ldlc",
			})): [],
			doc?.querySelector(
				"#listing > div.wrap-list > div.listing-product > ul.pagination"
			)
				? Array.from(
						doc.querySelector(
							"#listing > div.wrap-list > div.listing-product > ul.pagination"
						).children
				  ).length - 1
				: 1,
		],
		{
			base: "ldlc.com/informatique/pieces-informatique/carte-graphique-interne/c4684/+fdi-1.html",
			page: (i) =>
				`ldlc.com/informatique/pieces-informatique/carte-graphique-interne/c4684/page${i}/+fdi-1.html`,
		}
	);
}
