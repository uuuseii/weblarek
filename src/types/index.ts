import { categoryMap } from "../utils/constants";

export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TPayment = "online" | "cash";
export type BuyerErrors = Partial<Record<keyof IBuyer, string>>;
export type TCardData = Pick<IProduct, "title" | "price" | "id">;
export type TCardCatalog = TCardData & Pick<IProduct, "image" | "category">;
export type CategoryKey = keyof typeof categoryMap;
export type TCardPreview = IProduct & {
  buttonText: string;
  disabled?: boolean;
};
export type TCardBasket = TCardData & {
  index: number;
};
export type TPaymentView = "card" | "cash";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export interface IProductResponce {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderResponce {
  id: string;
  total: number;
}

export interface HeaderData {
  counter: number;
}

export interface GalleryData {
  catalog: HTMLElement[];
}

export interface ModalData {
  content: HTMLElement;
}

export interface OrderSuccesData {
  total: number;
}

export interface BasketData {
  items: HTMLElement[];
  price: string;
}

export interface IFormState {
  isValid: boolean;
  errors: string;
}

export interface OrderFormData {
  address: string;
  payment: string;
}

export interface ContactsFormData {
  phone: string;
  email: string;
}
