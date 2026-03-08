import { AppEvents } from "../../types/events";
import type { IBuyer, TPayment, BuyerErrors } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
  private _payment: TPayment | null = null;
  private _email = "";
  private _phone = "";
  private _address = "";

  constructor(protected events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.address !== undefined) this._address = data.address;

    this.events.emit(AppEvents.BuyerChanged);
  }

  getData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clear(): void {
    this._payment = null;
    this._email = "";
    this._phone = "";
    this._address = "";

    this.events.emit(AppEvents.BuyerChanged);
  }

  validate(): BuyerErrors {
    const errors: BuyerErrors = {};

    if (!this._payment) errors.payment = "Не выбран вид оплаты";
    if (!this._email) errors.email = "Укажите email";
    if (!this._phone) errors.phone = "Укажите телефон";
    if (!this._address) errors.address = "Укажите адрес";

    return errors;
  }
}
