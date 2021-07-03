import { JSDOM } from "jsdom";
import { api, pages } from "../utils";
const FormData = require("form-data");

export default async function getGraphicCards() {
	return await pages(
		async (data, _i, pages) => {
			await new Promise((r) => setTimeout(r, 500));
			return [
				data.products
					.filter(({ prx }) => prx)
					.map(({ name, url, prx }) => ({
						name,
						price: parseFloat(
							new JSDOM(
								`<html><body>${prx.val}</body></html>`
							).window.document
								.querySelector("body")
								.textContent.replace("€", ".")
						),
						url,
						site: "cdiscount",
					})),
				pages,
			];
		},
		{
			base: "cdiscount.com/ProductListUC.mvc/UpdateJsonPage",
			page: (i) =>
				`cdiscount.com/ProductListUC.mvc/UpdateJsonPage?page=${i}`,
			func: (url) => {
				const fd = new FormData();
				fd.append("TechnicalForm.SiteMapNodeId", "22382");
				fd.append("TechnicalForm.DepartmentId", "107140204");
				fd.append("TechnicalForm.ProductId", "");
				fd.append("hdnPageType", "ProductList");
				fd.append("TechnicalForm.ContentTypeId", "3");
				fd.append("TechnicalForm.SellerId", "");
				fd.append("TechnicalForm.PageType", "PRODUCTLISTER");
				fd.append("TechnicalForm.LazyLoading.ProductSheets", "False");
				fd.append("TechnicalForm.BrandLicenseId", "0");
				fd.append("TechnicalForm.OriginalHash", "#_his_");
				fd.append(
					"FacetForm.SelectedFacets[0]",
					"Neuf ou occasion/neuf"
				);
				fd.append("SortForm.SelectedSort", "PERTINENCE");
				fd.append("ProductListTechnicalForm.Keyword", "");
				fd.append("ProductListTechnicalForm.TemplateName", "InLine");

				return api(url, {
					method: "POST",
					body: fd,
					headers: {
						"x-requested-with": "XMLHttpRequest",
					},
				}).then((res) => res.json());
			},
			first: (data) =>
				parseFloat(
					new JSDOM(
						`<html><body>${data.pagination}</body></html>`
					).window.document.querySelector("#PaginationForm_TotalPage")
						.value
				),
		}
	);
}
