
import _ from 'lodash';
import { Events, IAppState, ICard, IOderForm } from '../../types';
import { Model } from '../base/model';
import { IEvents } from '../base/events';
import { CardItem } from './CardItem';
import { Order } from './Order';

/**
 * Описываем класс модели приложения
 */
export class AppState extends Model<IAppState> {
	private _cardList: ICard[];
	private _order: IOderForm;
	private _selectCard: ICard;

	/**
	 * Конструктор
	 * @param { Partial<IAppState> } data - используемые моделью данные
	 * @param { IEvents } events объект брокера событий
	 */
	constructor(data: Partial<IAppState>, events: IEvents) {
		super(data, events);
	}

	/**
	 * Описываем методы установки и получения значений полей ( get, set)
	 */
	set cardList(items: ICard[]) {
		this._cardList = items.map((item) => new CardItem(item, this.events));
		this.emitChanges(Events.LOAD_CARDS, { catalog: this.cardList });
	}

	get cardList(): ICard[] {
		return this._cardList;
	}

	get basket(): ICard[] {
		return this._cardList.filter((item) => item.selected);
	}

	get order(): IOderForm {
		return this._order;
	}

	get selectCard(): ICard {
		return this._selectCard;
	}

	set selectCard(value: ICard) {
		this._selectCard = value;
		this.emitChanges('preview:changed', this.selectCard);
	}

	/**
	 * Проверяем гналичие карточки
	 * @param { ICard } item - проверяемая карточка
	 * @returns признак наличия карточки в корзине
	 */
	isCardInBasket(item: ICard): boolean {
		return item.selected;
	}

	/**
	 * Получаем количество карточек  в корзине
	 * @returns количество карточек в корзине
	 */
	getCardInBasket(): number {
		return this.basket.length;
	}

	/**
	 * Получаем список id карточек в корзине
	 * @returns список индексов в корзине
	 */
	getCardIdInBasket(): string[] {
		return this.basket.map((item) => item.id);
	}

	/**
	 * Получаем общую стоимость товаров в корзине
	 * @returns стоимость товаров в корзине
	 */
	getTotalPrice(): number {
		return this.basket.reduce((a, c) => a + c.price, 0);
	}

	/**
	 * Инициализируем объект заказа
	 */
	makeOrder(): IOderForm {
		this._order = new Order({}, this.events);
		this.order.clearOderForm();
		return this.order;
	}

	/**
	 * Очищаем корзину
	 */
	clearBasket(): void {
		this.basket.forEach((card) => card.removeFromBasket());
	}
}

