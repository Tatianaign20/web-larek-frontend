import { Events, ICard, CardCategoryType } from '../../types';
import { Model } from '../base/model';

/**
* Описываем класс модели карточки товара
*/
export class CardItem extends Model<ICard> {
	id: string;
	title: string;
	description: string;
	image: string;
	category: CardCategoryType;
	price: number;
	selected: boolean;

	/**
	 * Добавляем карточку товара в корзину, selected - значение выбора
	 */
	addToBasket(): void {
		this.selected = true;
		this.emitChanges(Events.CHANGE_CARD_IN_BASKET, { selected: this.selected });
	}

	/**
	 * Удаляем карточку товара из корзины, selected - значение выбора
	 */
	removeFromBasket() {
		this.selected = false;
		this.emitChanges(Events.CHANGE_CARD_IN_BASKET, { isOrdered: this.selected });
	}
}



