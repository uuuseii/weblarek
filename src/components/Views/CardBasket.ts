import { TCardBasket, ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

export class CardBasket extends Card<TCardBasket> {
  protected basketItemIndexElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    actions?: ICardActions,
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

    if (actions?.onDelete) {
      this.buttonElement.addEventListener('click', actions.onDelete);
    }
  }

  set index(value: number) {
    this.basketItemIndexElement.textContent = String(value + 1);
  }
}
