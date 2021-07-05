import { sites } from "../config.js";
import * as sitesApis from "../sites/index.js";

export default async function getGraphicCards() {
	const sitesProducts = await Promise.all(
		sites.map(
			async (site) =>
				await sitesApis[
					site
						.split(".")
						.map((text, i) =>
							i === 0
								? text
								: text[0].toLocaleUpperCase() + text.substr(1)
						)
						.join("")
				]()
		)
	);
	let products = [];
	sitesProducts.map((items) => items.map((item) => products.push(item)));
	products = products.filter(({ price }) => price)
	return products;
}
