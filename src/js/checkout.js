import CheckoutProcess from "./CheckoutProcess.mjs";
import { qs } from "./utils.mjs";

const checkoutProcess = new CheckoutProcess("so-cart", ".order-summary");
checkoutProcess.init();

const zipInput = document.getElementById("zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    if (zipInput.value && zipInput.value.length === 5) {
      checkoutProcess.calculateOrderTotal();
    }
  });
  zipInput.addEventListener("input", () => {
    if (zipInput.value && zipInput.value.length === 5) {
      checkoutProcess.calculateOrderTotal();
    }
  });
}

const form = document.getElementById("checkout-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (form.checkValidity()) {
      try {
        const response = await checkoutProcess.checkout(form);
        console.log("Order submitted:", response);
        alert("Order placed successfully!");
      } catch (error) {
        console.error("Checkout error:", error);
        alert("There was an error processing your order. Please try again.");
      }
    } else {
      form.reportValidity();
    }
  });
}

