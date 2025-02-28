import { Component } from '../base/components';
import { IEvents } from '../base/events';

export interface IStartPage {
	catalog: HTMLElement[];
	counter: number;
	locked: boolean;
}

export class StartPage extends Component<IStartPage> {
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._wrapper = document.querySelector('.page__wrapper');
		this._basket = document.querySelector('.header__basket');
		this._counter = document.querySelector('.header__basket-counter');
		this._catalog = document.querySelector('.gallery');

		this._basket.addEventListener('click', () => {
			events.emit('basket:open');
		});
	}

	set catalog(value: HTMLElement[]) {
		this._catalog.replaceChildren(...value);
	}

	setCounter(value: number) {
		this.setText(this._counter, value);
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}
