import { ensureElement } from '../../utils/utils';
import { View } from '../base/view';
import { IEvents } from '../base/events';

/**
 * Описываем интерфейс формы
 * @property { boolean } valid - валидность формы
 * @property { string[] } errors - ошибки в форме
 */
interface IFormState {
	valid: boolean;
	errors: string[];
}

/**
*Описываем класс формы
*/
export class Form<T> extends View<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	/**
	 * Конструктор
	 * @constructor
	 * @param { HTMLFormElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events - брокер событий
	 */
	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);

		/**
		 * Элементы, которые используются в форме
		 */
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		/**
		 * Ставим слушатель на событие ввода в поле формы
		 */
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		/**
		 * Ставим слушатель на событие нажатия кнопки закрытия формы
		 */
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	/**
	 * Делаем событие при изменении в поле ввода
	 * @param { keyof T } field - отслеживаем свойство
	 * @param { string } value - новое значение в поле
	 */
	protected onInputChange(field: keyof T, value: string): void {
		const eventName = `${this.container.name}.${String(field)}:change`;
		this.events.emit(eventName, {
			field,
			value,
		});
	}

	/**
	 * Устанавливаем значения полей
	 */
	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState): HTMLFormElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

