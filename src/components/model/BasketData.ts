import { Model } from '../base/model';
import { ICardBasketData, TCardBasket } from '../../types/index';

export class BasketData extends Model <ICardBasketData> {
    //перечень карточек в корзине ?? может, ICard
    protected _items: TCardBasket[]; 
    //events из Model

    set items(items: TCardBasket[]) {
        this._items = items;
        this.events.emit('basket: change');
    }
    get items() {
        return this._items;
    }


    // getCardListInBasket(): TCardBasket[] {}
    // //получить массив карточек, а именно id всех карточек)
    // getCardListInBasket(): TCardBasket[] {}
    // //чтобы число карточек получить для отображения на корзине
    // getCardListInBasketNumber(): number {}
    //добавить карточку в корзину, в нем коложить карточку в массив, запустить событие, чтобы корзина обновилась, и создать этот товар в корзине
    addToBasket(item: TCardBasket): void {
        this._items=[item, ...this._items];
        this.events.emit('basket: change');

    }
    //удалить карточку из массива, вызвать событие изменения массива в корзине, убираем из корзины
    removeFromBasket(itemId: string): void {
        this._items = this._items.filter(item => item._id !== itemId);
        this.events.emit('basket: change');
    }
    // //??возможно добавить метод обновл. карточки 6 место 11.51
    // updateCardListInBasket(item: TCardBasket): {}
    // getTotalPrice(): number {} // получить полную сумму заказа
    // clearBasketData(): void {} //очистить данные корзины после заказа
}



