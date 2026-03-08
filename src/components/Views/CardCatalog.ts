import { CategoryKey, TCardCatalog } from "../../types";
import { AppEvents } from "../../types/events";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class CardCatalog extends Card<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.container.addEventListener("click", () => {
      console.log(this._id);
      this.events.emit(AppEvents.ProductCardSelect, { id: this._id });
    });
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
