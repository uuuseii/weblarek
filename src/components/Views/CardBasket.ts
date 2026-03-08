import { TCardBasket } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { AppEvents } from "../../types/events";

export class CardBasket extends Card<TCardBasket> {
  protected basketItemIndexElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.basketItemIndexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.buttonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      this.events.emit(AppEvents.BasketItemDelete, { id: this._id });
    });
  }

  set index(value: number) {
    this.basketItemIndexElement.textContent = String(value + 1);
  }
}
