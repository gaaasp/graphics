import { cards } from "../config";
import { getGraphicCards } from "../utils";
import Redis from "ioredis";

module.exports = async (_req, res) => {
	const redis = new Redis(process.env.REDIS_URL);
	let oldProducts = await redis.get("products");
	console.log(oldProducts);
	oldProducts = oldProducts ? JSON.parse(oldProducts) : [];
	const products = await getGraphicCards();
	const wanted = (products) =>
		products.filter(({ name, price }) =>
			cards.find(
				(card) =>
					name
						.toLocaleLowerCase()
						.indexOf(card.name.toLocaleLowerCase()) >= 0 &&
					price <= card.price
			)
		);
	const removed = wanted(
		oldProducts.filter(
			({ name, site }) =>
				!products.find(
					(product) => product.name === name && product.site === site
				)
		)
	);
	const added = wanted(
		products.filter(
			({ name, site }) =>
				!oldProducts.find(
					(product) => product.name === name && product.site === site
				)
		)
	);
	await redis.set("products", JSON.stringify(products));
	res.json({ added, removed });
};
