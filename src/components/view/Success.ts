import {IOrderResult} from "../../types/index";
import {Component} from "../base/components";
import {IEvents} from "../base/events";
import { ensureElement } from "../../utils/utils";

export class Success extends Component<IOrderResult> {
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
    this._button = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this._button.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total (value: number) {
    this.setText(this._total, `Списано ${value} синапсов`);
  }
}