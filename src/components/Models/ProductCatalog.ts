import type { IProduct } from "../../types/index";

export class ProductCatalog {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  constructor() {}

  setProducts(products: IProduct[]): void {
    this._products = products;
  }

  getProducts(): IProduct[] {
    return this._products
  }

  getProductByID(id: string): IProduct | undefined {
    return this._products.find((product) => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this._selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}