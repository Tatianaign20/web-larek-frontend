import { ensureElement, formatSinaps } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ICardActions } from './Card';
import { View } from '../base/view';

/**
 * Описываем интерфейс элементов корзины - карточек товаров
 * @property { number } index - номер по порядку в корзине
 * @property { string } title - название 
 * @property { number } price - цена 
 * @method delete - метод удаления товара из корзины
 */
interface IBasketCard {
	index: number;
	title: string;
	price: number;
	delete: () => void;
}

/**
 * Описываем класс карточки в корзине
 * TODO: сделать наследование от Card
 */
export class BasketItem extends View<IBasketCard> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _deleteBtn: HTMLButtonElement;

	/**
	 * Конструктор
	 * @param { HTMLElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events брокер событий
	 * @param { ICardActions } actions доступные события для привязки
	 */
	constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
		super(container, events);

		/**
		 * Элемены объектов корзины, которые используются
		 */
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._deleteBtn = container.querySelector('.card__button');

		/**
		 * Ставим слушатель на событие удаление элемента из корзины по клику 
		 */
		this._deleteBtn.addEventListener('click', (event: MouseEvent) => {
			actions.onClick?.(event);
		});
	}

	set index(value: number) {
		this.setText(this._index, value + 1);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, formatSinaps(value));
	}
}

