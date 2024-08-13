
import { Events, OderFormErrors, ICard, IOderForm, PaymentType } from '../../types';
import { Model } from '../base/model';

/**
 * Описываем класс модели заказа товара 
 * type PaymentType = "card" | "cash";
 * Методы get и set в классе - описываем установку и получение значений полей
 */
export class Order extends Model<IOderForm> {
	protected _payment: PaymentType = 'card';
	protected _address: string = '';
	protected _email: string = '';
	protected _phone: string = '';
	protected _items: ICard[] = [];
	protected _formErrors: OderFormErrors = {};

	/**
	 * Проверяем поля формы
	 */
	validateOderForm(): void {
		this.validatePayment();
		this.validateAddress();
		this.validateEmail();
		this.validatePhone();
		this.emitChanges(Events.VALIDATE_ORDER, this._formErrors);
	}

	/**
	 * Очищаем поля заказа
	 */
	clearOderForm(): void {
		this._payment = 'card';
		this._address = '';
		this._email = '';
		this._phone = '';
	}
	
	set payment(value: PaymentType) {
		this._payment = value;
		this.validateOderForm();
	}

	get payment() {
		return this._payment;
	}

	/**
	 * Проверяем способ оплаты, если пустое поле - выдаем ошибку
	 */
	validatePayment(): void {
		if (!this._payment) {
			this._formErrors.payment = 'Укажите способ оплаты';
		} else {
			this._formErrors.payment = '';
		}
	}

	set address(value: string) {
		this._address = value;
		this.validateOderForm();
	}

	get address() {
		return this._address;
	}

	/**
	 * Проверяем адрес доставки, если пустое поле - выдаем ошибку
	 */
	validateAddress(): void {
		if (!this._address) {
			this._formErrors.address = 'Укажите адрес доставки';
		} else {
			this._formErrors.address = '';
		}
		this.emitChanges(Events.VALIDATE_ORDER, this._formErrors);
	}

	set email(value: string) {
		this._email = value.toLowerCase();
		this.validateOderForm();
	}

	get email() {
		return this._email;
	}

	/**
	 * Проверяем электронную почту, если пустое поле - выдаем ошибку
	 */
	validateEmail(): void {
		if (!this._email) {
			this._formErrors.email = 'Введите электронную почту';
		}
		if (!this._email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
			this._formErrors.email = 'Некорректная электронная почта';
		} 
		else {
			this._formErrors.email = '';
		}
		this.emitChanges(Events.VALIDATE_ORDER, this._formErrors);
	}

	set phone(value: string) {
		this._phone = value;
		this.validateOderForm();
	}

	get phone() {
		return this._phone;
	}

	/**
	 * Проверяем телефон, если пустое поле - выдаем ошибку
	 */
	validatePhone(): void {
		if (!this._phone) {
			this._formErrors.phone = 'Введите номер телефона';
		} 
		if (!this._phone.match(/^((\+7|7|8)+([0-9]){10})$/)){
			this._formErrors.phone = 'Некорректный номер телефона';
		}
		else {
			this._formErrors.phone = '';
		}
		this.emitChanges(Events.VALIDATE_ORDER, this._formErrors);
	}

	set items(value: ICard[]) {
		this._items = value;
	}

	get items() {
		return this._items;
	}

	/**
	 * Завершаем заказ
	 */
	submitOder(): void {
		this.clearOderForm();
		this.emitChanges(Events.PLACE_ORDER);
	}
}


