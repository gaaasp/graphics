import { api, pages } from "../utils/index.js";
import FormData from "form-data";

export default async function getGraphicCards() {
	return await pages(
		async (doc, _i, prices) => [
			doc ? Array.from(
				doc.querySelector(
					"#tpl__products-list > div:nth-child(5) > div > div.col-12.col-lg-8.col-xl-9 > div.js-is-loading.active > ul"
				).children
			).map((product) => ({
				name: product.children[1].children[0].children[0].children[0]
					.textContent,
				price: prices?.find(({ id }) => id === product.dataset.id)
					?.price,
				url: `https://www.materiel.net/produit/${product.dataset.id.substr(
					2
				)}.html`,
				site: "materiel.net",
			})) : [],
			doc ? Math.ceil(
				parseFloat(
					doc
						.querySelector(
							"#products-list > div > div.col-auto > div > div.col-auto.d-none.d-xl-block > span"
						)
						.textContent.split(" produits")[0]
						.split("sur ")[1]
				) /
				parseFloat(
					doc
						.querySelector(
							"#products-list > div > div.col-auto > div > div.col-auto.d-none.d-xl-block > span"
						)
						.textContent.split(" sur")[0]
						.split("- ")[1]
				)
			) : 1,
			prices,
		],
		{
			base: "materiel.net/carte-graphique/l426/+fdi-1/",
			page: (i) => `materiel.net/carte-graphique/l426/+fdi-1/page${i}/`,
			first: async (doc) => {
				if (doc) {
					let shopsAvailability = {};
					Array.from(
						doc.querySelector(
							"#tpl__products-list > div:nth-child(5) > div > div.col-12.col-lg-8.col-xl-9 > div.js-is-loading > ul"
						).children
					).map(
						(product) =>
						(shopsAvailability[product.dataset.id] =
							product.children[2].dataset.nbShopAvailability)
					);
					const fd = new FormData();
					fd.append(
						"json",
						doc
							.querySelector("#dataLayout")
							.nextElementSibling.nextElementSibling.textContent.split(
								"dataLayout.offerListJson = "
							)[1]
							.replace(/\n/g, "")
					);
					fd.append("shopId", "-1");
					fd.append("displayGroups", "Web");
					fd.append(
						"shopsAvailability",
						JSON.stringify(shopsAvailability)
					);
					return await api("materiel.net/product-listing/stock-price/", {
						method: "POST",
						body: fd,
						headers: {
							"x-requested-with": "XMLHttpRequest",
						},
					})
						.then((res) => res.json())
						.then((json) => {
							return Object.entries(json.price).map(
								([key, value]) => ({
									id: key,
									price: parseFloat(
										`${value
											.replace("&nbsp;", "")
											.split('o-product__price">')[1]
											.split("</span>")[0]
											.split("€")[0]
										}.${value
											.replace("&nbsp;", "")
											.split('o-product__price">')[1]
											.split("<sup>")[1]
											?.split("</sup>")[0] || 0
										}`
									),
								})
							);
						});
				} else {
					return []
				}
			},
		}
	);
}
