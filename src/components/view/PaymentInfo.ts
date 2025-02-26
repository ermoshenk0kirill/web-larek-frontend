import {Form} from "./Form";
import {IPayment} from "../../types";
import {ensureAllElements} from "../../utils/utils";
import {IEvents} from "../base/events";

export class PaymentInfo extends Form<IPayment> {
  protected _buttons: HTMLButtonElement[];
  protected _address: HTMLInputElement;

  constructor(protected container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    
    this._buttons.forEach((button) => {
      button.addEventListener('click', () => this.onInputChange('payment', button.name));
    })
  }

  set payment (value: string) {
    this._buttons.forEach((button) => {
      this.toggleClass(button, 'button_alt_active', button.name === value);
    })
  }

  set address (value: string) {
    (this.container.elemnts.namedItem('address') as HTMLInputElement).value = value;
  }
}