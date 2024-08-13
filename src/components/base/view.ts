import { IEvents } from './events';

/**
 * Описываем базовый абстрактный класс VIEW, который будет использоваться (наследоваться) в классах сущностей VEIW. Устанавливаем для конструктора и ряда методов модификатор protected, который означает, что конструктор и методы могут использоваться только внутри класса или у класса - наследника.
 */
export abstract class View<T> {
	/**
	 * Конструктор
	 * @param { HTMLElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events - объект брокера событий
	 */
	protected constructor(protected readonly container: HTMLElement, protected events: IEvents) {}

	/**
	 * Переключаем класс
	 * @param { HTMLElement } element - конкретный объект
	 * @param { string } className - имя класса
	 * @param { boolean } force - в значении true - add, в значении false - remove
	 */
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	/**
	 * Установливаем текстовое содержимое
	 * @param { HTMLElement } element - конкретный объект
	 * @param { unknown } value - добавляемый текст
	 */
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	/**
	 * Сменяем статус блокировки
	 * @param { HTMLElement } element - конкретный объект
	 * @param { boolean } state - целевое состояние блокировки
	 */
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	/**
	 * Скрываем элемент
	 * @param { HTMLElement } element - скрываемый элемент
	 */
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	/**
	 * Показываем элемент
	 * @param { HTMLElement } element - отображаемый элемент
	 */
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}
	/**
	 * Установливаем изображение с альтернативным текстом
	 * @param { HTMLElement } element - объект изображения
	 * @param { string } src - путь до картинки
	 * @param { string } alt - альтернативный текст для изображения
	 */

	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	/**
	 * Возвращаем объект контейнера (метод render)
	 * @param { Partial<T> } data - используемые данные для заполнения макета
	 * @returns { HTMLElement } - заполненный template
	 */
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}