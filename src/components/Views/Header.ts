import { HeaderData } from "../../types";
import { AppEvents } from "../../types/events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Header extends Component<HeaderData> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit(AppEvents.BasketOpen);
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
