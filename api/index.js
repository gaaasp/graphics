import { cards } from "../config";
import { getGraphicCards } from "../utils";

module.exports = async (_req, res) => {
	const products = await getGraphicCards();
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
