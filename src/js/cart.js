import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function removeItemFromCart(index) {
  const cartItems = getLocalStorage("so-cart") || [];
  
  if (index >= 0 && index < cartItems.length) {
    cartItems.splice(index, 1);
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}

const listElement = document.querySelector(".product-list");
if (listElement) {
  listElement.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-card__remove")) {
      const index = parseInt(e.target.getAttribute("data-index"));
      removeItemFromCart(index);
    }
  });
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    const listEl = document.querySelector(".product-list");
    if (listEl) {
      listEl.innerHTML = '<li class="empty">Your cart is empty.</li>';
    }
    const totalEl = document.querySelector("#cart-total");
    if (totalEl) totalEl.textContent = "$0.00";
    return;
  }

  const htmlItems = cartItems.map((item, index) => cartItemTemplate(item, index));
  const listEl = document.querySelector(".product-list");
  if (listEl) {
    listEl.innerHTML = htmlItems.join("");
  }

  const total = cartItems.reduce((sum, i) => {
    const price = Number(i.FinalPrice) || 0;
    return sum + price;
  }, 0);

  const totalEl = document.querySelector("#cart-total");
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function cartItemTemplate(item, index) {
  const price = Number(item.FinalPrice) || 0;
  const imageUrl = item.Images?.PrimaryMedium || item.Image || "";
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${imageUrl}"
      alt="${item.Name || item.NameWithoutBrand}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name || item.NameWithoutBrand}</h2>
  </a>
  <p class="cart-card__color">${(item.Colors && item.Colors[0] && item.Colors[0].ColorName) || ''}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${price.toFixed(2)}</p>
  <button class="cart-card__remove" data-index="${index}" aria-label="Remove ${item.Name || item.NameWithoutBrand} from cart">Remove</button>
</li>`;

  return newItem;
}

renderCartContents();
