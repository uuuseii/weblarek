import { OrderSuccesData } from "../../types";
import { AppEvents } from "../../types/events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class OrderSuccess extends Component<OrderSuccesData> {
  protected closeButton: HTMLButtonElement;
  protected descriptionElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );

    this.closeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.events.emit(AppEvents.OrderSuccessClose);
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
