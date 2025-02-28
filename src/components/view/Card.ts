import { Component } from '../base/components';
import { ensureElement } from '../../utils/utils';
import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ICard } from '../../types/index';

export class Card extends Component<ICard> {
	protected events: IEvents;
	protected id: string;
	protected element: HTMLElement;

	protected category: HTMLElement;
	protected title: HTMLElement;
	protected description: HTMLElement;
	protected image: HTMLImageElement;
	protected price: HTMLElement;
	protected button: HTMLButtonElement;
	protected deleteButton: HTMLButtonElement;
	protected basketIndex: HTMLElement;
	protected categoryColor: Record<string, string> = {
		'софт-скил': '_soft',
		'хард-скил': '_hard',
		'другое': '_other',
		'дополнительное': '_additional',
		'кнопка': '_button',
	};

	constructor(public container: HTMLTemplateElement, events: IEvents, action?: string) {
		super(container);

		this.events = events;

		this.category = this.container.querySelector('.card__category');
		this.title = ensureElement<HTMLElement>('.card__title', this.container);
		this.description = this.container.querySelector('.card__text');
		this.image = this.container.querySelector('.card__image') as HTMLImageElement;
		this.price = ensureElement<HTMLElement>('.card__price', this.container);
		this.button = this.container.querySelector('.card__button') as HTMLButtonElement;
		this.deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;
		this.basketIndex = this.container.querySelector('.basket__item-index');

        // Если есть кнопка "Добавить в корзину"
    if (this.button) {
      this.button.addEventListener('click', () => {
          this.events.emit('basket:add', { id: this.id, buyCheck: this.updateButtonName() });
      });
    }

    // Если есть кнопка "Удалить из корзины"
    if (this.deleteButton) {
      this.deleteButton.addEventListener('click', () => {
          this.events.emit('basket:remove', { id: this.id });
      });
    }

    // Если нет кнопки, но нужна реакция на клик всей карточки
    if (!this.button && !this.deleteButton) {
      this.container.addEventListener('click', () => {
				this.events.emit('card:open', { id: this.id });
		});
		
    }
	}

	set titleValue(value: string) {
		this.setText(this.title, value);
	}

	set categoryValue(value: string) {
		this.setText(this.category, value);
		this.category.className = `card__category card__category${this.categoryColor[value]}`;
	}

	set descriptionValue(value: string) {
		this.setText(this.description, value);
	}

	set imageValue(value: string) {
		this.setImage(this.image, value);
	}

	set priceValue(value: string | number | null) {
		if (value === null) {
			this.setDisabled(this.button, true);
			this.setText(this.price, 'Бесценно');
		} else {
			this.setText(this.price, `${String(value)} синапсов`);
		}
	}

	set valid(value: boolean) {
		this.button.disabled = !value;
}

	set idValue(value: string) {
		this.id = value;
	}

	get idValue(): string {
		return this.id;
	}

	updateButtonName() {
		this.button.classList.toggle('card__button-buy_inactive')
		if (this.button.classList.contains('card__button-buy_inactive')) {
				this.button.disabled = true;
		}
  }

	updateButtonState(isDisabled: boolean) {
    this.button.disabled = isDisabled;
}
}