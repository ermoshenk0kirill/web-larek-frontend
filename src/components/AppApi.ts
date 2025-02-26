import {IOrderResult, IOrder, IOrderForm, ICard, ICardsData} from '../types/index';
import {Api, ApiListResponse} from '../components/base/api'

export interface IApi {
  getCardById(id: string): Promise<ICard>;
  getCardList(): Promise<ICard[]>;
  orderLots(order: IOrder): Promise<IOrderResult>;
}

export class AppApi extends Api implements IApi {
  readonly cdn: string;

  constructor(baseUrl: string, cdn: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
    }
    getCardList(): Promise<ICard[]> {
      return this.get('/product').then((data: ApiListResponse<ICard>) =>
          data.items.map((item) => ({
              ...item, 
              image: this.cdn + item.image
          }))
      );
  }
    
    getCardById(id: string): Promise<ICard> {
      return this.get(`/product/${id}`).then(
          (item: ICard) => ({
              ...item,
              image: this.cdn + item.image,
          })
      );
  }


  orderLots(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then(
        (data: IOrderResult) => data
    );
  }
}