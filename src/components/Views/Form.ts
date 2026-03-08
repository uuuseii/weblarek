import { IFormState } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class Form<T> extends Component<T & IFormState> {
  protected errorsElement: HTMLElement;
  protected submitButton?: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
    const button = this.container.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    if (button) {
      this.submitButton = button;
    }

    container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  protected abstract onSubmit(): void;

  set isValid(value: boolean) {
    if (this.submitButton) {
      this.submitButton.disabled = !value;
    }
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
