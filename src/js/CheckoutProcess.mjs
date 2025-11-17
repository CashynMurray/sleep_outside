import { getLocalStorage } from "./utils.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name || item.NameWithoutBrand,
    price: item.FinalPrice || 0,
    quantity: 1
  }));
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => {
      const price = Number(item.FinalPrice) || 0;
      return sum + price;
    }, 0);

    const itemCountEl = document.querySelector(`${this.outputSelector} #item-count`);
    const itemTotalEl = document.querySelector(`${this.outputSelector} #item-total`);
    
    if (itemCountEl) {
      itemCountEl.textContent = this.list.length;
    }
    if (itemTotalEl) {
      itemTotalEl.textContent = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxEl = document.querySelector(`${this.outputSelector} #tax`);
    const shippingEl = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotalEl = document.querySelector(`${this.outputSelector} #order-total`);

    if (taxEl) {
      taxEl.textContent = `$${this.tax.toFixed(2)}`;
    }
    if (shippingEl) {
      shippingEl.textContent = `$${this.shipping.toFixed(2)}`;
    }
    if (orderTotalEl) {
      orderTotalEl.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  async checkout(form) {
    const formData = formDataToJSON(form);
    
    const order = {
      orderDate: new Date().toISOString(),
      fname: formData.fname,
      lname: formData.lname,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      code: formData.code,
      items: packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2)
    };

    const ExternalServicesModule = await import("./ExternalServices.mjs");
    const dataSource = new ExternalServicesModule.default();
    return await dataSource.checkout(order);
  }
}

