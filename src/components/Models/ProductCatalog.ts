import { AppEvents } from "../../types/events";
import type { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class ProductCatalog {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this._products = products;
    this.events.emit(AppEvents.ProductsChanged, this.getProducts());
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getProductByID(id: string): IProduct | undefined {
    return this._products.find((product) => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this._selectedProduct = product;
    this.events.emit(AppEvents.ProductSelected);
  }

  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}
