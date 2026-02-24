import './scss/styles.scss';

import { apiProducts } from './utils/data';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/Communication/WebLarekApi';
import { API_URL } from './utils/constants';

const catalog = new ProductCatalog();
catalog.setProducts(apiProducts.items);

console.log('Массив товаров из каталога:', catalog.getProducts());

const firstProduct = catalog.getProducts()[0];
if (firstProduct) {
  console.log('Товар по id:', catalog.getProductByID(firstProduct.id));

  catalog.setSelectedProduct(firstProduct);
  console.log('Выбранный товар:', catalog.getSelectedProduct());
}

const cart = new Cart();

if(firstProduct) {
  cart.addItem(firstProduct);
  console.log('Товары в корзине:', cart.getItems());
  console.log('Сумма корзины:', cart.getTotalPrice());
  console.log('Количество товаров:', cart.getItemsCount());
  console.log('Есть ли товар в корзине', cart.hasItem(firstProduct.id));

  cart.removeItem(firstProduct.id);
  console.log('Корзина после удаления:', cart.getItems());

}

const buyer = new Buyer();

console.log('Данные покупателя (пустые поля):', buyer.getData());
console.log('Ошибки валидации (пустые поля):', buyer.validate());

buyer.setData({payment: 'online', email: 'test@test.com'});
console.log('Данные покупателя (частично):', buyer.getData());
console.log('Ошибки валидации (частично):', buyer.validate());

buyer.setData({phone: '+79999999999', address: 'Москва, улица Льва Толстого, 16'});
console.log('Данные покупателя (полностью)', buyer.getData());
console.log('Ошибки валидации:', buyer.validate());

buyer.clear();
console.log('Покупатель после очищения данных:', buyer.getData());

const apiClient = new Api(API_URL);
const webLarekApi = new WebLarekApi(apiClient);

const catalogModel = new ProductCatalog();

webLarekApi.getProducts()
  .then((products) => {
    catalogModel.setProducts(products);
    console.log('Каталог товаров (с сервера):', catalogModel.getProducts());
  })
  .catch((err) => {
    console.log('Ошибка при загрузке каталога:', err);
  })
