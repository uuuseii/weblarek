import { ModalData } from "../../types";
import { AppEvents } from "../../types/events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Modal extends Component<ModalData> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );

    this.closeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.events.emit(AppEvents.ModalClose);
    });

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.events.emit(AppEvents.ModalClose);
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add("modal_active");
    document.body.style.overflow = "hidden";
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.contentElement.replaceChildren();
    document.body.style.overflow = "";
  }
}
