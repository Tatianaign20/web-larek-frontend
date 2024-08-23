import { Api, ApiListResponse, ApiPostMethods } from './base/api';
import { ICard, IOrder, IOrderResult } from '../types';

export interface IAPIweblarek {
    getCardsListApi(): Promise<ICard[]>;
    getCardApi(id: string): Promise<ICard>;
    postOrderCardsApi(order: IOrder): Promise<IOrderResult>;

}

export class APIweblarek extends Api implements IAPIweblarek {
    readonly cdn: string;
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }


    getCardsListApi(): Promise<ICard[]> {
        return this.get('/product/').then((data: ApiListResponse<ICard>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getCardApi(id: string): Promise<ICard> {
        return this.get(`/product/${id}`).then(
            (item: ICard) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    postOrderCardsApi(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}