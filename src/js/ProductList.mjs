// ProductList.mjs
import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imageUrl = product.Images?.PrimaryMedium || product.Image || "";
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img src="${imageUrl}" alt="Image of ${product.NameWithoutBrand}">
      <h2 class="card__brand">${product.Brand?.Name || ""}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice?.toFixed(2) || "0.00"}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    // You passed in this information to make the class as reusable as possible.
    // Being able to define these things when you use the class will make it very flexible
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // the dataSource will return a Promise...so you can use await to resolve it.
    const list = await this.dataSource.getData(this.category);
    // next, render the list
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}

