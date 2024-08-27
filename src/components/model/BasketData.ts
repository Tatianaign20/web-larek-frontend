import { Model } from '../base/model';
import { ICardBasketData, TCardBasket } from '../../types/index';

export class BasketData extends Model <ICardBasketData> {
    protected _items: TCardBasket[]=[];
    //events из Model

    set items(items: TCardBasket[]) {
        this._items = items;
        this.events.emit('basket: change', this._items);
    }
    get items() {
        return this._items;
    }
// получить id карочек в корзине
    getCardListInBasket(): string []{
         return this._items.map(item => item.id);
    }

    // //чтобы число карточек получить для отображения на корзине
    getCardListInBasketNumber(): number {
        return this._items.length;
    }
    getTotalPrice(): number {
        return this._items.reduce((acc, item) => acc + item.price, 0);
    } 
    
    //добавить карточку в корзину
    addToBasket(item: TCardBasket): void {
        this._items=[item, ...this._items];
    }
    //удалить карточку из массива
    removeFromBasket(itemId: string): void {
        this._items = this._items.filter(item => item.id !== itemId);
    }


    inBasket(itemID: string) {
        return this._items.some(item => item.id === itemID);
    }

    clearBasketData(): void {
        this._items = [];
    } 

}



