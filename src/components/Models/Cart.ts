import { AppEvents } from "../../types/events";
import type { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Cart {
  private _items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this._items.push(product);
      this.events.emit(AppEvents.CartChanged);
    }
  }

  removeItem(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
    this.events.emit(AppEvents.CartChanged);
  }

  clear(): void {
    this._items = [];
    this.events.emit(AppEvents.CartChanged);
  }

  getTotalPrice(): number {
    return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getItemsCount(): number {
    return this._items.length;
  }

  hasItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}
