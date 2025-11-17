import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { qs, getParam } from "./utils.mjs";

const category = getParam("category") || "tents";

const dataSource = new ProductData();
const listElement = qs(".product-list");
const productList = new ProductList(category, dataSource, listElement);
productList.init();

const titleElement = qs("h2");
if (titleElement) {
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");
  titleElement.textContent = `Top Products: ${categoryName}`;
}

