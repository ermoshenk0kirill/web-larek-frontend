import { Component } from '../base/components';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export interface IFormState {
	valid: boolean;
	errors: string;
}

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});

		// Проверяем, пустое ли поле, и обновляем валидность формы
		if (field === 'address') {
			this.valid = value.trim().length > 0;
		}
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	get errors() {
		return this._errors.textContent;
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}

	updateForm() {
		const inputs = this.container.querySelectorAll('input');
		inputs.forEach((input) => (input.value = ''));
		this.errors = '';
		this.valid = false;
	}

	clearForm() {
		const inputs = this.container.querySelectorAll('input');
		inputs.forEach((input) => (input.value = ''));
		this.errors = '';
		this.valid = false;
	}
}
