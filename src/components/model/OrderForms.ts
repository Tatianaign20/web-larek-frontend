import { Model } from '../base/model';
import { IOderFormsData, TPaymentType, TOrderFormPaymentDelivery, TOrderFormContacts } from '../../types/index';

export class OrderForms extends Model <IOderFormsData> {
    protected _payment: TPaymentType;
    protected _address: string;
    protected _email: string;
    protected _phone: string;
    //events из Model

    set payment(payment: TPaymentType) {
        this._payment = payment;
        this.events.emit('edit-payment: change');
    }

    get payment(): TPaymentType {
        return this._payment;
    }

    set address(address: string) {
        this._address = address;
        this.events.emit('edit-address: change');
    }

    get address(): string {
        return this._address;
    }
    
    set email(email: string) {
        this._email = email;
        this.events.emit('edit-email: change');
    }

    get email(): string {
        return this._email;
    }

    set phone(phone: string) {
        this._phone = phone;
        this.events.emit('edit-phone: change');
    }

    get phone(): string {
        return this._phone;
    }

    //валидировать 1 форму, вызвать событие проверки
    checkValidationPaymentivery(data: Record<keyof TOrderFormPaymentDelivery, string>): void {
            const errors: string[] = [];
            if (!data.address) {
                errors.push('Адрес - обязательное поле');
            }
            else {
                return null;
            }
            this.events.emit('form-address-input: validation');
            if(!data.payment) {
                errors.push('Необходимо выбрать способ оплаты');
            }
            else {
                return null;   
            }
            this.events.emit('form-payment: validation');
        }

    //валидировать  2 форму,вызвать событие проверки
    checkValidationContacts(data: Record<keyof TOrderFormContacts, string>): void {
        const errors: string[] = [];
        if (!data.email) {
            errors.push('Email - обязательные поля');
        }
        else {
            return null;
        }
        this.events.emit('form-email-input: validation');

        if (!data.phone) {
            errors.push('Телефон - обязательные поля');
        }
        else {
            return null;
        }
        this.events.emit('form-phone-input: validation');
    }
    //очистить данные форм
    clearOrderForms(): void {
        this._payment = 'card';
        this._address = '';
        this._email = '';
        this._phone = '';
        this.events.emit('edit-payment: change');
        this.events.emit('edit-address: change');
        this.events.emit('edit-email: change');
        this.events.emit('edit-phone: change');
    }
}
