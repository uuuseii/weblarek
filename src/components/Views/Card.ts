import { TCardData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export abstract class Card<T extends TCardData> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected _id: string = "";

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value !== null ? `${value} синапсов` : "Бесценно";
  }

  set id(value: string) {
    this._id = value;
  }
}
