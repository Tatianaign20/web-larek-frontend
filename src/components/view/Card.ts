import { CardCategoryType } from '../../types';
import { CATEGOTY_MAP } from '../../utils/constants';
import { ensureElement, formatSinaps } from '../../utils/utils';
import { View } from '../base/view';
import { IEvents } from '../base/events';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

/**
 * Описываем интерфейс карточки
 * @property { string } category - категория товара
 * @property { string } title - название товара
 * @property { string } image - изображение товара
 * @property { number } price - цена товара
 * @property { string } description - описание товара
 * @property { string } button - кнопка добавления в заказ - текст
 */
interface ICard {
	category: string;
	title: string;
	image: string;
	price: number;
	description: string;
	button?: string;
}

/**
 * Описываем класс карточки
 */
export class Card extends View<ICard> {
	private _category: HTMLElement;
	private _title: HTMLElement;
	private _image?: HTMLImageElement;
	private _description?: HTMLElement;
	private _price?: HTMLElement;
	private _button?: HTMLButtonElement

	/**
	 * Кнструктор
	 * @param { string } blockName - название блока
	 * @param { HTMLElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events - брокер событий
	 * @param { ICardActions } actions - доступные события для привязки
	 */
	constructor(
		protected blockName: string,
		container: HTMLElement,
		events: IEvents,
		actions?: ICardActions
	) {
		super(container, events);

		/**
		* Элементы у карточки, которые используются
		*/
		this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
		this._description = container.querySelector(`.${blockName}__text`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);

		/**
		 * Добавляем слушатели событий для внутренней кнопки или для всей карточки
		 * */
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	/**
	 * Устанавливаем значения полей
	 */
	/**
	* Для категории карточки
	*/
	set category(value: CardCategoryType) {
		this.setText(this._category, value);
		this._category.className = '';
		const mainClass = `${this.blockName}__category`;
		const additionalClass = CATEGOTY_MAP[value];
		this._category.classList.add(mainClass, `${mainClass}_${additionalClass}`);
	}

	/**
	 *Для заголовка карточки
	 */
	set title(value: string) {
		this.setText(this._title, value);
	}

    /**
	 * Для изображения карточки
	 */
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

    /**
	 * Для описания карточки
	 */
	set description(value: string) {
		this.setText(this._description, value);
	}

	/**
	 * Для цены
	 */
	set price(value: number) {
		this.setText(this._price, formatSinaps(value));
		this.setDisabled(this._button, value == null);
	}

	/**
	 * Для кнопки
	 */
	set button(value: string) {
		this.setText(this._button, value);
	}
}

