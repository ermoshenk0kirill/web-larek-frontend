export interface ICard {
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;
	buttonText: boolean;
	id: string;
}

export interface ICardsData {
	cards: ICard[];
	setPreview(cardId: ICard): void;
	getCard(id: string): ICard;
}

// интерфейс корзины
export interface IBasketData {
	basketCards: IBasket[];
	addCard(card: ICard): void;
	removeCard(card: IBasket): void;
	getCards(): IBasket[];
	getTotalPrice(): number;
	checkCard(card: IBasket): boolean;
	getCount(): number;
	getCardsId(): string[];
	clearBasket(): void;
}

export interface IBasketView {
	items: HTMLElement[];
	total: string;
	itemsBasket: string[];
}

// тип для модального окна корзины

export interface IUserData {
	getUserInfo(field: keyof IOrderForm): void;
	setInputField(field: keyof IOrderForm, value: string): void;
	validation(): void;
	clearUser(): void;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

export interface ICardAction {
	onClick(event: MouseEvent): void;
}

export type ICardList = Pick<ICard, 'title' | 'image' | 'category' | 'price'>;
export type IBasket = Pick<ICard, 'title' | 'id' | 'price'>;
export type ICardInfo = Pick<
	ICard,
	'title' | 'description' | 'image' | 'category'
>;
export type IInfo = Pick<IOrderForm, 'email' | 'phone' | 'address' | 'payment'>;
export type Successful = string;
export type ApiMethods = 'POST' | 'GET' | 'DELETE';
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
