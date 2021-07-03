import { pages } from "../utils/index.js";

export default async function getGraphicCards() {
	return await pages(
		(doc) => [
			Array.from(
				doc.querySelector("#content > section > div > section").children
			).map((product) => ({
				name: product.children[product.childElementCount - 1]
					.children[1].children[0].children[0].textContent,
				price: parseFloat(
					product.children[
						product.childElementCount - 1
					].children[2].children[0].children[0].children[0].textContent
						.slice(0, -2)
						.replace(",", ".")
				),
				url:
					"https://www.topachat.com" +
					product.children[product.childElementCount - 1].children[1]
						.children[0].href,
				site: "topachat",
			})),
			Math.max(
				1,
				...Array.from(
					doc.querySelector("#content > section > div > nav").children
				)
					.filter(({ href }) => href)
					.map((a) =>
						parseFloat(
							a.href.slice(0, -5).split("puis_page_est_")[1]
						)
					)
			),
		],
		{
			base: "topachat.com/pages/produits_cat_est_micro_puis_rubrique_est_wgfx_pcie_puis_nblignes_est_200_puis_ordre_est_S_puis_sens_est_DESC_puis_f_est_s-1.html",
			page: (i) =>
				`topachat.com/pages/produits_cat_est_micro_puis_rubrique_est_wgfx_pcie_puis_page_est_${i}_puis_nblignes_est_200_puis_f_est_s-1.html`,
		}
	);
}
