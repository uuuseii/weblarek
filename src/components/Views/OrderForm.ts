import { OrderFormData, TPaymentView } from "../../types";
import { AppEvents } from "../../types/events";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export class OrderForm extends Form<OrderFormData> {
  protected addressInputElement: HTMLInputElement;
  protected cardButtonElement: HTMLButtonElement;
  protected cashButtonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container, events);

    this.addressInputElement = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );
    this.cardButtonElement = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.cashButtonElement = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );

    this.addressInputElement.addEventListener("input", () => {
      this.events.emit(AppEvents.FormFieldChange, {
        field: "address",
        value: this.addressInputElement.value,
      });
    });

    this.cardButtonElement.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit(AppEvents.FormFieldChange, {
        field: "payment",
        value: "card",
      });
    });

    this.cashButtonElement.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit(AppEvents.FormFieldChange, {
        field: "payment",
        value: "cash",
      });
    });
  }

  protected onSubmit(): void {
    this.events.emit(AppEvents.OrderFormSubmit);
  }

  set address(value: string) {
    this.addressInputElement.value = value;
  }

  set payment(value: TPaymentView) {
    this.cardButtonElement.classList.toggle(
      "button_alt-active",
      value === "card",
    );
    this.cashButtonElement.classList.toggle(
      "button_alt-active",
      value === "cash",
    );
  }
}
