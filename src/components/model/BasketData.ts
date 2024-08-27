import { Model } from '../base/model';
import { ICardBasketData, TCardBasket } from '../../types/index';

export class BasketData extends Model <ICardBasketData> {
    //перечень карточек в корзине ?? может, ICard
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
    
    //добавить карточку в корзину, в нем положить карточку в массив, запустить событие, чтобы корзина обновилась, и создать этот товар в корзине
    addToBasket(item: TCardBasket): void {
        this._items=[item, ...this._items];
        // this.events.emit('basket: addcard', this._items);
        // this.updateCardListInBasket();
    }
    //удалить карточку из массива, вызвать событие изменения массива в корзине, убираем из корзины
    removeFromBasket(itemId: string): void {
        this._items = this._items.filter(item => item.id !== itemId);
        // this.events.emit('basket: removecard', this._items);
        // this.updateCardListInBasket();
    }
    // ??возможно добавить метод обновл. карточки 6 место 11.51
    // updateCardListInBasket(){
    //      this.events.emit('counter: change', this._items);
    // }


    inBasket(itemID: string) {
        return this._items.some(item => item.id === itemID);
    }

    //очистить корзину ПОКА не работает
    clearBasketData(): void {
        this._items = [];
        // this.updateCardListInBasket();
    } 

}



