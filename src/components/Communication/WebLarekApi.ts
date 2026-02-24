import type {
  IApi,
  IProduct,
  IProductResponce,
  IOrderRequest,
  IOrderResponce 
} from "../../types";

export class WebLarekApi {
  private _api: IApi;
  
  constructor(api: IApi) {
    this._api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this._api.get<IProductResponce>('/product/').then((data) => data.items);
  }

  postOrder(order: IOrderRequest): Promise<IOrderResponce> {
    return this._api.post<IOrderResponce>('/order/', order);
  }
}