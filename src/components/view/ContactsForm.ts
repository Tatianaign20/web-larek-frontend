import { IEvents } from '../base/events';
import { Form } from './Form';

/**
 * Описываем интерфейс формы с контактной информацией
 * @property { string } email - электронная почта для связи
 * @property { string } phone - телефон для связи
 */
export interface IOrderContactsForm {
	email: string;
	phone: string;
}

/**
 * Описываем класс формы с контактной информацией
 */
export class ContactsForm extends Form<IOrderContactsForm> {
	/**
	 * Конструктор
	 * @param { HTMLFormElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events - брокер событий
	 */
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
    
	/**
	 * Устанавливаем значения полей формы (телефон и электронная почта)
	 */
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}




