import { ICard, ICardsData, ICardList} from "../../../src/types/index";
import { IEvents } from "../base/events";


export class CardData implements ICardsData {
  protected _cards: ICard[];
  protected _preview: string | null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }
  
  // устанавливает список карточек
  set cards(cards:ICard[]) {
    this._cards = cards;
    this.events.emit('cards:render')
}

// возвращает список карточек
  get cards () {
    return this._cards;
  }

  getCard(cardId: string) {
    return this._cards.find((item) => item.id === cardId)
}

  setPreview(cardId: ICard) {
        this._preview = cardId.id;
        this.events.emit('preview:render', cardId)
}

  getPreview () {
    return this._preview;
  }
}