import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/Communication/WebLarekApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";

import { ProductCatalog } from "./components/Models/ProductCatalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";

import { Header } from "./components/Views/Header";
import { Gallery } from "./components/Views/Gallery";
import { Modal } from "./components/Views/Modal";
import { Basket } from "./components/Views/Basket";
import { CardCatalog } from "./components/Views/CardCatalog";
import { CardPreview } from "./components/Views/CardPreview";
import { CardBasket } from "./components/Views/CardBasket.ts";
import { OrderForm } from "./components/Views/OrderForm.ts";
import { ContactsForm } from "./components/Views/ContactsForm.ts";
import { OrderSuccess } from "./components/Views/OrderSuccess.ts";
import { ensureElement } from "./utils/utils.ts";
import { AppEvents } from "./types/events.ts";
import { IOrderRequest, TPaymentView } from "./types/index.ts";

const apiClient = new Api(API_URL);
const webLarekApi = new WebLarekApi(apiClient);

const events = new EventEmitter();

const catalog = new ProductCatalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const headerContainer = ensureElement<HTMLElement>(".header__container");
const galleryContainer = ensureElement<HTMLElement>(".gallery");
const modalContainer = ensureElement<HTMLElement>("#modal-container");

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPriviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);

const basket = new Basket(cloneTemplate(basketTemplate), events);

let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;

webLarekApi
  .getProducts()
  .then((products) => {
    catalog.setProducts(products);
    console.log("Каталог товаров (с сервера):", catalog.getProducts());
  })
  .catch((err) => {
    console.log("Ошибка при загрузке каталога:", err);
  });

function cloneTemplate(template: HTMLTemplateElement): HTMLElement {
  return template.content.firstElementChild!.cloneNode(true) as HTMLElement;
}

events.on(AppEvents.ProductsChanged, () => {
  const products = catalog.getProducts();

  const cards = products.map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);

    return card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      image: `${CDN_URL}/${product.image}`,
      category: product.category,
    });
  });

  gallery.catalog = cards;
});

events.on<{ id: string }>(AppEvents.ProductCardSelect, ({ id }) => {
  const product = catalog.getProductByID(id);

  if (product) {
    catalog.setSelectedProduct(product);
  }
});

events.on(AppEvents.ProductSelected, () => {
  const product = catalog.getSelectedProduct();

  if (!product) {
    return;
  }

  const card = new CardPreview(cloneTemplate(cardPriviewTemplate), events);
  const isInCart = cart.hasItem(product.id);

  const buttonText =
    product.price === null
      ? "Недоступно"
      : isInCart
        ? "Удалить из корзины"
        : "Купить";

  modal.render({
    content: card.render({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: `${CDN_URL}/${product.image}`,
      category: product.category,
      buttonText,
      disabled: product.price === null,
    }),
  });
  modal.open();
});

events.on(AppEvents.CartToggle, () => {
  const product = catalog.getSelectedProduct();

  if (!product || product.price === null) {
    return;
  }

  if (cart.hasItem(product.id)) {
    cart.removeItem(product.id);
  } else {
    cart.addItem(product);
  }

  modal.close();
});

events.on(AppEvents.CartChanged, () => {
  header.counter = cart.getItemsCount();
});

events.on(AppEvents.BasketOpen, () => {
  const items = cart.getItems().map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);

    return card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      index,
    });
  });

  basket.items = items;
  basket.price = cart.getTotalPrice();
  basket.isButtonEnabled = cart.getItemsCount() > 0;

  modal.render({
    content: basket.render(),
  });
  modal.open();
});

events.on<{ id: string }>(AppEvents.BasketItemDelete, ({ id }) => {
  cart.removeItem(id);

  const items = cart.getItems().map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);

    return card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      index,
    });
  });

  basket.items = items;
  basket.price = cart.getTotalPrice();
  basket.isButtonEnabled = cart.getItemsCount() > 0;

  modal.render({
    content: basket.render(),
  });
});

events.on(AppEvents.BasketOrder, () => {
  orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
  contactsForm = null;

  const buyerData = buyer.getData();
  const errors = buyer.validate();

  const orderErrors: string[] = [];

  if (errors.payment) {
    orderErrors.push(errors.payment);
  }

  if (errors.address) {
    orderErrors.push(errors.address);
  }

  const paymentValue =
    buyerData.payment === "online"
      ? "card"
      : buyerData.payment === "cash"
        ? "cash"
        : undefined;

  modal.render({
    content: orderForm.render({
      address: buyerData.address,
      payment: paymentValue ?? "",
      isValid: orderErrors.length === 0,
      errors: orderErrors.join("; "),
    }),
  });

  modal.open();
});

events.on(AppEvents.OrderFormSubmit, () => {
  const errors = buyer.validate();

  if (errors.payment || errors.address) {
    return;
  }

  contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
  orderForm = null;

  const buyerData = buyer.getData();
  const contactsErrors: string[] = [];

  if (errors.email) {
    contactsErrors.push(errors.email);
  }

  if (errors.phone) {
    contactsErrors.push(errors.phone);
  }

  modal.render({
    content: contactsForm.render({
      email: buyerData.email,
      phone: buyerData.phone,
      isValid: contactsErrors.length === 0,
      errors: contactsErrors.join("; "),
    }),
  });

  modal.open();
});

events.on<{ field: string; value: string }>(
  AppEvents.FormFieldChange,
  ({ field, value }) => {
    if (field === "payment") {
      const payment = value as TPaymentView;

      buyer.setData({
        payment: payment === "card" ? "online" : "cash",
      });
    }

    if (field === "address") {
      buyer.setData({
        address: value,
      });
    }

    if (field === "phone") {
      buyer.setData({
        phone: value,
      });
    }

    if (field === "email") {
      buyer.setData({
        email: value,
      });
    }
  },
);

events.on(AppEvents.BuyerChanged, () => {
  const buyerData = buyer.getData();
  const errors = buyer.validate();

  if (orderForm) {
    const orderErrors: string[] = [];

    if (errors.payment) {
      orderErrors.push(errors.payment);
    }

    if (errors.address) {
      orderErrors.push(errors.address);
    }

    orderForm.address = buyerData.address;

    if (buyerData.payment === "online") {
      orderForm.payment = "card";
    }

    if (buyerData.payment === "cash") {
      orderForm.payment = "cash";
    }

    orderForm.isValid = orderErrors.length === 0;
    orderForm.errors = orderErrors.join("; ");
  }

  if (contactsForm) {
    const contactsErrors: string[] = [];

    if (errors.email) {
      contactsErrors.push(errors.email);
    }

    if (errors.phone) {
      contactsErrors.push(errors.phone);
    }

    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    contactsForm.isValid = contactsErrors.length === 0;
    contactsForm.errors = contactsErrors.join("; ");
  }
});

events.on(AppEvents.ContactsFormSubmit, async () => {
  const errors = buyer.validate();

  if (errors.email || errors.phone) {
    return;
  }

  const buyerData = buyer.getData();

  if (!buyerData.payment) {
    return;
  }

  const orderData: IOrderRequest = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: cart.getTotalPrice(),
    items: cart.getItems().map((item) => item.id),
  };

  try {
    const result = await webLarekApi.postOrder(orderData);

    cart.clear();
    buyer.clear();
    orderForm = null;
    contactsForm = null;

    const success = new OrderSuccess(cloneTemplate(successTemplate), events);

    modal.render({
      content: success.render({
        total: result.total,
      }),
    });

    modal.open();
  } catch (error) {
    console.log("Ошибка при отправке заказа:", error);
  }
});

events.on(AppEvents.ModalClose, () => {
  modal.close();
});

events.on(AppEvents.OrderSuccessClose, () => {
  modal.close();
});
