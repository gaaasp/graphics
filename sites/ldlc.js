import { request } from "../utils";

export default async function getGraphicCards() {
	return await request(
		"ldlc.com/informatique/pieces-informatique/carte-graphique-interne/c4684/+fdi-1.html"
	).then(async (doc) => {
		let products = JSON.parse(
			doc
				.querySelector("head > script:nth-child(38)")
				.textContent.split("dataLayer.push(")[1]
				.slice(0, -3)
				.replaceAll("\n", "")
				.replaceAll("'", '"')
		).ecommerce.impressions.map(
			({ brand, category, id, list, name, position, price }) => ({
				name,
				price: parseFloat(price),
				site: "ldlc",
			})
		);
		const pages = await Promise.all(
			(doc.querySelector(
				"#listing > div.wrap-list > div.listing-product > ul.pagination"
			)
				? Array.from(
						Array(
							Array.from(
								doc.querySelector(
									"#listing > div.wrap-list > div.listing-product > ul.pagination"
								).children
							).length - 2
						).keys()
				  )
				: []
			).map(
				async (value) =>
					await request(
						`ldlc.com/informatique/pieces-informatique/carte-graphique-interne/c4684/page${
							value + 2
						}/+fdi-1.html`
					).then((doc) =>
						JSON.parse(
							doc
								.querySelector("head > script:nth-child(38)")
								.textContent.split("dataLayer.push(")[1]
								.slice(0, -3)
								.replaceAll("\n", "")
								.replaceAll("'", '"')
						).ecommerce.impressions.map(
							({
								brand,
								category,
								id,
								list,
								name,
								position,
								price,
							}) => ({
								name,
								price: parseFloat(price),
								site: "ldlc",
							})
						)
					)
			)
		);
		pages.map((items) => items.map((item) => products.push(item)));
		return products;
	});
}
