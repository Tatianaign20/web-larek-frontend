import { View } from "../base/view";
import { IEvents } from "../base/events";
import { ensureElement, formatNumber } from "../../utils/utils";
import { Events } from "../../types";


/**
 * Описываем  главную страницу (на странице отображаются список карточек товаров и значек корзина с количеством товаров) 
*/
/**
 * Описываем интерфейс IMainPage
 * @property { number } counter - счётчик элементов в корзине
 * @property { HTMLElement[] } galery - список карточек для отображения
 * @property { boolean } locked - признак блокировки прокрутки
 */
interface IMainPage {
	galery: HTMLElement[];
    counter: number;
	locked: boolean;
}

/**
 * Описываем класс для главной страницы*/
export class MainPage extends View<IMainPage> {
	private _counter: HTMLElement;
	private _gallery: HTMLElement;
	private _wrapper: HTMLElement;
	private _basket: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		/**
		 * Элементы главной страницы
		 */
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLButtonElement>('.header__basket');	

		/**
		 * Ставим слушатель на открытие корзины по клику
		 */
		this._basket.addEventListener('click', () => {
			this.events.emit(Events.OPEN_BASKET);
		});
	}

	/**
	 * Устанавливаем количество карточек в корзине
	 */
	set counter(value: number) {
		this.setText(this._counter, formatNumber(value));
	}

	/**
	 * Обновляем список карточек
	 */
	set galery(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	/**
	 * Обрабатываем блокировку страницы
	 */
	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}
