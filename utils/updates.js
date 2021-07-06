import Redis from "ioredis";
import { cards } from "../config.js";
import { getGraphicCards } from "../utils/index.js";

export default async function getUpdates(oldProducts) {
  const redis = new Redis(process.env.REDIS_URL);

  oldProducts = oldProducts ? JSON.parse(oldProducts) : [];
  const products = await getGraphicCards();

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

  redis.set("products", JSON.stringify(products));

  return { added, removed, newProducts: products };
}

const wanted = (products) =>
  products.filter(({ name, price }) =>
    cards.find(
      (card) =>
        name.toLocaleLowerCase().indexOf(card.name.toLocaleLowerCase()) >= 0 &&
        price <= card.price
    )
  );
