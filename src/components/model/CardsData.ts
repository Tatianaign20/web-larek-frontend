import { Model } from '../base/model';
import { ICard } from '../../types/index';


export class CardsData extends Model <ICard> {
    protected  _items: ICard[] = [];
    protected  _preview: string | null;
    //events из Model

    set items(items: ICard[]) {
        this._items = items;
        this.events.emit('cards: changed');
    }

    set preview(itemId: string | null) {
        if(!itemId){
            this._preview = null;
            return;
        }
        const selectedCard = this.getCard(itemId);
        if(selectedCard){
            this._preview = itemId;
            this.events.emit('card: selected', selectedCard);  
        }
    }
    get preview() {
        return this._preview;
    }

    //получить массив карточек
    getCardList() {
        return this._items;
    }  
      
    //получить карточку по id, возвращаем данные карточки
    getCard(itemId: string) {
        return this._items.find(item => item.id === itemId);
    }
}
