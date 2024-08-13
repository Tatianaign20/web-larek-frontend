import { Events, PaymentType } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from './Form';

/**
 * Описываем интерфейс формы с выбором способа оплаты и полем для адреса доставки
 * @property { PaymentType } payment - способ оплаты
 * @property { string } address - адрес доставки
 */
export interface IOrderDeliveryPaymentForm {
	payment: PaymentType;
	address: string;
}

/**
 * Описываем ккласс формы с выбором способа оплаты и полем для адреса доставки
 */
export class DeliveryPaymentForm extends Form<IOrderDeliveryPaymentForm> {
	protected _paymentContainer: HTMLDivElement;
	protected _paymentButtons: HTMLButtonElement[];


	/**
	 * Конструктор
	 * @param { HTMLFormElement } container - объект контейнера (темплейта)
	 * @param { IEvents } events - брокер событий
	 */
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		/**
		 * Элементы, которые используются в форме
		 */
		this._paymentContainer = ensureElement<HTMLDivElement>(
			'.order__buttons',
			this.container
		);
		this._paymentButtons = Array.from(
			this._paymentContainer.querySelectorAll('.button_alt')
		);

		/**
		 * Ставим слушатель на событие выбора кнопки с типом оплаты
		 */
		this._paymentContainer.addEventListener('click', (e: MouseEvent) => {
			const target = e.target as HTMLButtonElement;
			this.setClassPaymentMethod(target.name);
			events.emit(Events.SELECT_PAYMENT, { target: target.name });
		});
	}

	/**
	 * Выделяем кнопку в зависимости от выбранного способа оплаты
	 * @param { string } buttonName выбранный способ оплаты
	 */
	setClassPaymentMethod(buttonName: string): void {
		this._paymentButtons.forEach((btn) => {
			if (btn.name === buttonName) {
				this.toggleClass(btn, 'button_alt-active', true);
			} else {
				this.toggleClass(btn, 'button_alt-active', false);
			}
		});
	}

	/**
	 * Устанавливаем значения полей формы (способ оплаты и адрес)
	 */
	set payment(value: string){
		this.setClassPaymentMethod(value);
	}

	set address(value: PaymentType) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}


