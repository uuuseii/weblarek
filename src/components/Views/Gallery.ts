import { GalleryData } from "../../types";
import { Component } from "../base/Component";

export class Gallery extends Component<GalleryData> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.catalogElement = this.container;
  }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
