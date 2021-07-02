import { sites, cards } from "../config";
import * as sitesApis from "../sites";

module.exports = async (req, res) => {
	const sitesProducts = await Promise.all(
		sites.map(async (site) => await sitesApis[site]())
	);
	let products = [];
	sitesProducts.map((items) => items.map((item) => products.push(item)));
	res.json(
		products.filter(({ name, price }) =>
			cards.find(
				(card) =>
					name
						.toLocaleLowerCase()
						.indexOf(card.name.toLocaleLowerCase()) >= 0 &&
					price <= card.price
			)
		)
	);
};
