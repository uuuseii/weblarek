import { ContactsFormData } from "../../types";
import { AppEvents } from "../../types/events";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export class ContactsForm extends Form<ContactsFormData> {
  protected phoneInputElement: HTMLInputElement;
  protected emailInputElement: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container, events);

    this.phoneInputElement = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );
    this.emailInputElement = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );

    this.phoneInputElement.addEventListener("input", () => {
      this.events.emit(AppEvents.FormFieldChange, {
        field: "phone",
        value: this.phoneInputElement.value,
      });
    });

    this.emailInputElement.addEventListener("input", () => {
      this.events.emit(AppEvents.FormFieldChange, {
        field: "email",
        value: this.emailInputElement.value,
      });
    });
  }

  protected onSubmit(): void {
    this.events.emit(AppEvents.ContactsFormSubmit);
  }

  set phone(value: string) {
    this.phoneInputElement.value = value;
  }

  set email(value: string) {
    this.emailInputElement.value = value;
  }
}
