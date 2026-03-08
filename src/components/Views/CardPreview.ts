import { CategoryKey, TCardPreview } from "../../types";
import { AppEvents } from "../../types/events";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class CardPreview extends Card<TCardPreview> {
  protected descriptionElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.buttonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      this.events.emit(AppEvents.CartToggle);
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set disabled(value: boolean) {
    this.buttonElement.disabled = value;
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }
}
