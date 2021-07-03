import { request } from ".";

export default async function pages(
	f,
	{ base, page, first = async () => {}, func = request }
) {
	return await func(base)
		.then(async (doc) => f(doc, 0, await first(doc)))
		.then(async ([products, pages, first]) => {
			let returnedProducts = products;
			const pagesProducts = await Promise.all(
				Array.from(Array(pages - 1).keys()).map((value) =>
					func(page(value + 2)).then((doc) =>
						f(doc, value + 1, first)
					)
				)
			);
			pagesProducts.map(([p]) =>
				p.map((value) => returnedProducts.push(value))
			);
			return returnedProducts;
		});
}
