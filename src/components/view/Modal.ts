import { Events } from '../../types';
import { ensureElement } from '../../utils/utils';
import { View } from '../base/view';
import { IEvents } from '../base/events';

/**
 * Описываем интерфейс данных модального окна
 * @property { HTMLElement } content - отображаемое содержимое модального окна
 */
interface IModalData {
	content: HTMLElement;
}

/**
 * Описываем класс модального окна
 */
export class Modal extends View<IModalData> {
	private _closeButton: HTMLButtonElement;
	private _content: HTMLElement;

	/**
	 * Конструктор
	 * @param { HTMLElement } container - родительский контейнер для элементы
	 * @param { IEvents } events - брокер событий
	 */
	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		/**
		 * Элементы, которые используются
		 */
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		/** 
		 * Подписываемся на клики для закрытия
		 */
		[this._closeButton, this.container].forEach((element) => {
			element.addEventListener('click', () => {
				this.close();
				this.events.emit(Events.CLOSE_MODAL);
			});
		});
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	/**
	 * Устанавливаем значение
	 */
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	/**
	 * Открываем модальное окно
	 */
	open(): void {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit(Events.OPEN_MODAL);
	}

	/**
	 * Закрываем модальное окно
	 */
	close(): void {
		this.toggleClass(this.container, 'modal_active', false);
		this.content = null;
		this.events.emit(Events.CLOSE_MODAL);
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}


