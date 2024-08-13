import { ensureElement, formatSinaps } from "../../utils/utils";
import { View } from "../base/view";
import { IEvents } from "../base/events";

/**
 * Описываем интерфейс финальной страницы заказа
 * @property { number } total - общая стоимость заказа
 */
interface ISuccessOder {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

/**
 * Описываем класс страницы об успешном оформлении заказа
 */
export class Success extends View<ISuccessOder> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    /**
	 * Конструктор
	 * @param { HTMLElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events - брокер событий
	 * @param { ICardActions } actions - доступные события для привязки
	 */
    constructor(container: HTMLElement, events: IEvents, actions: ISuccessActions) {
        super(container, events);

		/**
		 * Элементы, которые используются
		 */
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);

        /**
         * Привязываем событие закрытия
         */
        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    /**
	 * Устанавливаем значение
	 */
    set total(value: number){
        this._total.textContent = `Списано ${formatSinaps(value)}`;
    }
}
