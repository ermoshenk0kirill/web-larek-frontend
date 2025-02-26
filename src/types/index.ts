
// интерфейс карточки
export interface ICard {
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;//

  id: string;
}
// интерфейс главной страницы
export interface ICardsData {
  cards: ICard[], // массив карточек
  setPreview(cardId: ICard): void;
  getCard(id: string): ICard; // получить карточку по id
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
export type IBasket = Pick<ICard, 'title' | 'id' | 'price'>

// интерфейс данных пользователя
export interface IUserData {
  payment: 'cash' | 'card'; //способ оплаты
  address: string;
  phone: string;
  mail: string;
}

// тип обычной карточки списка
export type ICardList = Pick<ICard, 'title' | 'image' | 'category' | 'price'>

// тип для модального окна карточки
//-=-=- под вопрос (снизу) надо писать или не надо =-=-=-=-=-=-
export type ICardInfo = Pick<ICard, 'title' | 'description' | 'image' | 'category'>

//------------------------------------------------------------
// ТИПЫ для информации о пользователе

// тип для модального окна оплаты
export type IPayment = Pick<IUserData, 'address' | 'payment'>

// тип для модального окна контактов
export type IContactInfo = Pick<IUserData, 'mail' | 'phone'>

//------------------------------------------------------------

// тип для успешного заказа
export type Successful = string;

// тип для API
export type ApiMethods = 'POST' | 'GET' |  'DELETE';

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IOrderForm {
  name: string;
  phone: string;
  mail: string;
  address: string;
  total: number;
}

export interface IOrder extends IOrderForm {
  items: string[];
  total: number;
}

export interface ICardAction {
  onClick(event: MouseEvent): void
}