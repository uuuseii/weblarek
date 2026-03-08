import { BasketData } from "../../types";
import { AppEvents } from "../../types/events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Basket extends Component<BasketData> {
  protected basketListElement: HTMLElement;
  protected basketPriceElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.basketListElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.basketPriceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit(AppEvents.BasketOrder);
    });
  }

  set items(value: HTMLElement[]) {
    this.basketListElement.replaceChildren(...value);
  }

  set price(value: number | null) {
    this.basketPriceElement.textContent =
      value !== null ? `${value} синапсов` : `0 синапсов`;
  }

  set isButtonEnabled(value: boolean) {
    this.buttonElement.disabled = !value;
  }
}
