import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData();

function addProductToCart(product) {
  const cart = getLocalStorage("so-cart") || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

async function renderProductDetails() {
  const productId = getParam("product");
  if (!productId) return;

  const product = await dataSource.findProductById(productId);
  if (!product) return;

  const imageUrl = product.Images?.PrimaryLarge || product.Image || "";
  
  document.querySelector("h3").textContent = product.Brand?.Name || "";
  document.querySelector("h2").textContent = product.NameWithoutBrand || product.Name || "";
  document.querySelector(".product-detail img").src = imageUrl;
  document.querySelector(".product-detail img").alt = product.NameWithoutBrand || product.Name || "";
  document.querySelector(".product-card__price").textContent = `$${product.FinalPrice?.toFixed(2) || "0.00"}`;
  
  const colorElement = document.querySelector(".product__color");
  if (colorElement && product.Colors && product.Colors[0]) {
    colorElement.textContent = product.Colors[0].ColorName || "";
  }
  
  const descriptionElement = document.querySelector(".product__description");
  if (descriptionElement && product.DescriptionHtmlSimple) {
    descriptionElement.innerHTML = product.DescriptionHtmlSimple;
  }
  
  const addToCartButton = document.getElementById("addToCart");
  if (addToCartButton) {
    addToCartButton.setAttribute("data-id", product.Id);
  }
}

async function addToCartHandler(e) {
  const productId = e.target.dataset.id;
  const product = await dataSource.findProductById(productId);
  addProductToCart(product);
}

renderProductDetails();

const addToCartButton = document.getElementById("addToCart");
if (addToCartButton) {
  addToCartButton.addEventListener("click", addToCartHandler);
}
