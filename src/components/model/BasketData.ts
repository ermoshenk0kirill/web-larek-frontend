import { ICard, IBasketData, IBasket} from "../../types/index";
import { IEvents } from "../base/events";

export class BasketData implements IBasketData {

  public basketCards: IBasket[];
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.basketCards = [];
  }

  // добавление карточки в корзину
  public addCard(card: ICard): void {
    if (!this.basketCards.some(item => item.id === card.id)) {
    const basketItem: IBasket = {
      title: card.title,
      id: card.id,
      price: card.price
    }
    this.basketCards.push(basketItem);}
  }

  // удаление товара из корзины
  public removeCard(card: IBasket): void {
    this.basketCards = this.basketCards.filter(item => item.id !== card.id)
  }

  // возвращает массив карточек коризны
  public getCards(): IBasket[] {
    return [...this.basketCards]
  }

  // возвращает общую стоимость корзины
  public getTotalPrice(): number {
    return this.basketCards.reduce((sum, card) => sum + card.price, 0);
  }

  // проврка наличия товра в корзине
  public checkCard(card: IBasket): boolean {
    return this.basketCards.some(item => item.id === card.id)
  }

  // возвращает количество товаров в корзине
  public getCount(): number {
    return this.basketCards.length;
  }

  //возвращает список id карточек в корзине 
  public getCardsId(): string[] {
    return this.basketCards.map(card => card.id);
  }

  // полная очистка корзины 
  public clearBasket(): void {
    this.basketCards = [];
    this.events.emit('basket:clear', this.basketCards);
  }
}


