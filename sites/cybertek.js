import { pages } from "../utils/index.js";

export default async function getGraphicCards() {
	return await pages(
		(doc) => [
			Array.from(
				doc.querySelector(
					"#content_product > div > div.categorie-r.categorie-block-r > div.categorie-filtre.lst_grid"
				).children
			).map((product) => ({
				name: Array.from(
					product.children[2].children[0].children[0].children
				)
					.filter((p) => p.nodeName === "DIV")[0]
					.children[0].textContent.split("- ")[0]
					.trim(),
				price: parseFloat(
					product.children[3].children[0].children[0].textContent.replace(
						"€",
						"."
					)
				),
				url: product.children[0].href,
				site: "cybertek",
			})),
			Math.ceil(
				parseFloat(
					doc
						.querySelector(
							"#_ctl0_ContentPlaceHolder1_nb_result > div"
						)
						.textContent.replace(/ /g, "")
				) /
					Array.from(
						doc.querySelector(
							"#content_product > div > div.categorie-r.categorie-block-r > div.categorie-filtre.lst_grid"
						).children
					).length
			),
		],
		{
			base: "cybertek.fr/carte-graphique-6.aspx",
			page: (i) => `cybertek.fr/carte-graphique-6.aspx?page=${i}`,
		}
	);
}
