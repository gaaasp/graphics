import { pages } from "../utils/index.js";

export default async function getGraphicCards() {
	return await pages(
		(document) => [
			Array.from(document.querySelector("#listing-infinite").children)
				.filter(
					(product) =>
						product.nodeName === "ARTICLE" &&
						!Array.from(
							Array.from(
								Array.from(product.children).filter(
									(p) => p.nodeName === "DIV"
								)[2].children[0].children
							).find(
								(item) =>
									item.className === "item__price--new-box"
							).children[0]
						).find((p) => p.className === "soonTm")
				)
				.map((product) => ({
					name: Array.from(
						Array.from(product.children).filter(
							(p) => p.nodeName === "DIV"
						)[1].children
					).find((p) => p.nodeName === "H2").children[0].title,
					price: parseFloat(
						Array.from(
							Array.from(product.children).filter(
								(p) => p.nodeName === "DIV"
							)[2].children[0].children
						)
							.find(
								(item) =>
									item.className === "item__price--new-box"
							)
							.children[0].textContent.replace(/ /g, "")
							.replace(",", ".")
					),
					url: `https://rueducommerce.fr${
						Array.from(product.children).filter(
							(p) => p.nodeName === "DIV"
						)[0].children[0].href
					}`,
					site: "rueducommerce",
				})),
			Math.ceil(
				parseFloat(
					document.querySelector(
						"#product__listing-list-footer > div > p > i.to"
					).textContent
				) /
					parseFloat(
						document.querySelector(
							"#product__listing-list-footer > div > p > i.from"
						).textContent
					)
			),
		],
		{
			base: "rueducommerce.fr/rayon/composants-16/carte-graphique-231",
			page: (i) =>
				`rueducommerce.fr/rayon/composants-16/carte-graphique-231?page=${i}`,
		}
	);
}
