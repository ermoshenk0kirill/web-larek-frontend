
// интерфейс карточки
export interface ICard {
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;

  id: string;
}


// интерфейс данных пользователя
export interface IUserData {
  payment: string; //способ оплаты
  address: string;
  phone: string;
  mail: string;
}

// интерфейс главной страницы
export interface ICardList {
  cards: ICard[], // массив карточек
  cardId: string // id карточки

  getCardId(id: string): ICard; // получить карточку по id
}

// интерфейс корзины
export interface IBasket {
  cards: ICard[],
  totalPrice: number
}

// интерфейс оплаты 
export interface IUserPayment {
  setInfoPayment(data: IPayment): void; // установить данные оплаты
  setValidation(data: Record<keyof IPayment, string>): boolean; // проверка данных оплаты
}

export interface IUserContact {
  setInfoContact(data: IContactInfo): void; // установить данные контактов
  setValidation(data: Record<keyof IContactInfo, string>): boolean; // проверка данных контактов
}


// тип обычной карточки списка
export type IListCard = Pick<ICard, 'title' | 'image' | 'category' | 'price'>

// тип для модального окна карточки
export type ICardInfo = Pick<ICard, 'title' | 'description' | 'image' | 'category'>

// тип для модального окна корзины
export type IDeleteBasket = Pick<ICard, 'title' | 'description' | 'price'>

//------------------------------------------------------------
// ТИПЫ для информации о пользователе

// тип для модального окна оплаты
export type IPayment = Pick<IUserData, 'address' | 'payment'>

// тип для модального окна контактов
export type IContactInfo = Pick<IUserData, 'mail' | 'phone'>

//------------------------------------------------------------

// тип для успешного заказа
export type Successful = string;
