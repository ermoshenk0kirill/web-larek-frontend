import { IBasketView } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/components";
import { IEvents } from "../base/events";


export class Basket extends Component<IBasketView> {
  protected _items: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;


  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this._items = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    const basketButton = ensureElement<HTMLButtonElement>('.header__basket');

    this._button.addEventListener('click', () => {
      events.emit('order:create');
    });
    this.items = [];

  }

  set items (value: HTMLElement[]) {
    if(value.length) {
      this._items.replaceChildren(...value);
      this.setDisabled(this._button, false);
    }
    else {
      this._items.replaceChildren(createElement('p', {textContent: 'Корзина пуста'}));
      this.setDisabled(this._button, true);
    }
  }

  set total (value: number) {
    this.setText(this._total, `${String(value)} синапсов`);
  }
}