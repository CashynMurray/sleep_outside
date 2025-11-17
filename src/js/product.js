import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const dataSource = new ExternalServices();

function addProductToCart(product) {
  const cart = getLocalStorage("so-cart") || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
  alert("Item added to cart!");
}

async function addToCartHandler(e) {
  e.preventDefault();
  const productId = e.target.dataset.id;
  if (!productId) {
    console.error("No product ID found");
    return;
  }
  try {
    const product = await dataSource.findProductById(productId);
    if (product) {
      addProductToCart(product);
    } else {
      console.error("Product not found");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}

async function renderProductDetails() {
  const productId = getParam("product");
  if (!productId) {
    console.error("No product ID in URL");
    return;
  }

  try {
    const product = await dataSource.findProductById(productId);
    if (!product) {
      console.error("Product not found");
      return;
    }

    const imageUrl = product.Images?.PrimaryLarge || product.Image || "";
    
    const h3Element = document.querySelector("h3");
    const h2Element = document.querySelector("h2");
    const imgElement = document.querySelector(".product-detail img");
    const priceElement = document.querySelector(".product-card__price");
    
    if (h3Element) h3Element.textContent = product.Brand?.Name || "";
    if (h2Element) h2Element.textContent = product.NameWithoutBrand || product.Name || "";
    if (imgElement) {
      imgElement.src = imageUrl;
      imgElement.alt = product.NameWithoutBrand || product.Name || "";
    }
    if (priceElement) priceElement.textContent = `$${product.FinalPrice?.toFixed(2) || "0.00"}`;
    
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
      addToCartButton.addEventListener("click", addToCartHandler);
    } else {
      console.error("Add to cart button not found");
    }
  } catch (error) {
    console.error("Error rendering product details:", error);
  }
}

renderProductDetails();
