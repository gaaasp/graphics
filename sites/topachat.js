import { request } from "../utils";

export default async function getGraphicCards() {
	return await request(
		"topachat.com/pages/produits_cat_est_micro_puis_rubrique_est_wgfx_pcie_puis_nblignes_est_200_puis_ordre_est_S_puis_sens_est_DESC_puis_f_est_s-1.html"
	).then(async (doc) => {
		let products = Array.from(
			doc.querySelector("#content > section > div > section").children
		).map((product) => ({
			name: product.children[product.childElementCount - 1].children[1]
				.children[0].children[0].innerText,
			price: parseFloat(
				product.children[
					product.childElementCount - 1
				].children[2].children[0].children[0].children[0].innerText
					.slice(0, -2)
					.replace(",", ".")
			),
			site: "topachat",
		}));
		const pagesArray = Array.from(
			doc.querySelector("#content > section > div > nav").children
		)
			.filter(({ href }) => href)
			.map((a) =>
				parseFloat(a.href.slice(0, -5).split("puis_page_est_")[1])
			);
		const pagesNumber = pagesArray.length
			? Math.max.apply(null, pagesArray)
			: 2;
		const pages = await Promise.all(
			Array.from(Array(pagesNumber - 2).keys()).map(
				async (value) =>
					await request(
						`topachat.com/pages/produits_cat_est_micro_puis_rubrique_est_wgfx_pcie_puis_page_est_${
							value + 2
						}_puis_nblignes_est_200_puis_f_est_s-1.html`
					).then((doc) =>
						Array.from(
							doc.querySelector(
								"#content > section > div > section"
							).children
						).map((product) => ({
							name: product.children[
								product.childElementCount - 1
							].children[1].children[0].children[0].innerText,
							price: parseFloat(
								product.children[
									product.childElementCount - 1
								].children[2].children[0].children[0].children[0].innerText
									.slice(0, -2)
									.replace(",", ".")
							),
							site: "topachat",
						}))
					)
			)
		);
		pages.map((items) => items.map((item) => products.push(item)));
		return products;
	});
}
