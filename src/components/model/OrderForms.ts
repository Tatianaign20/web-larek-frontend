import { Model } from '../base/model';
import { IOderFormsData, TPaymentType, TOrderFormPaymentDelivery, TOrderFormContacts } from '../../types/index';
// import { validate } from 'webpack';

export class OrderForms extends Model <IOderFormsData> {
    protected _payment: TPaymentType = 'card';
    protected _address: string;
    protected _email: string;
    protected _phone: string;
    protected _errors: string[] = [];
    //events из Model

    set payment(payment: TPaymentType) {
        this._payment = payment;
        this.checkValidationPayment();
        this.events.emit('edit-payment: change');
    }

    get payment(): TPaymentType {
        return this._payment;
    }

    set address(address: string) {
        this._address = address;
        this.checkValidationDelivery()
        this.events.emit('edit-address: change');
    }

    get address(): string {
        return this._address;
    }
    
    set email(email: string) {
        this._email = email;
        this.checkValidationEmail();
        this.events.emit('edit-email: change');
    }

    get email(): string {
        return this._email;
    }

    set phone(phone: string) {
        this._phone = phone;
        this.checkValidationPhone();
        this.events.emit('edit-phone: change');
    }

    get phone(): string {
        return this._phone;
    }

    set errors(errors: string[]) {
        this._errors = errors;
        this.events.emit('error: vaidation');
    }
    get errors(): string[] {
        return this._errors;
    }

    //валидировать 1 форму, вызвать событие проверки
    checkValidationPaymentDelivery(): void {
        this.checkValidationPayment(); 
        this.checkValidationDelivery();
        this.events.emit('form-payment-delivery-input: validation');
        }

    checkValidationPayment(): void {
         if(!this.payment) {
             this.errors.push('Необходимо выбрать способ оплаты');
         }
         else {
             return null;   
        }
        this.events.emit('form-payment: validation', this.errors);
    }

    checkValidationDelivery(): void {
         if (!this.address) {
             this.errors.push('Адрес - обязательное поле');
         }
        else {
            return null;
        }
        this.events.emit('form-address-input: validation', this.errors);
    }

    //валидировать  2 форму,вызвать событие проверки
    checkValidationContacts(): void {
        this.checkValidationEmail();
        this.checkValidationPhone();
        this.events.emit('form-contacts-input: validation');
    }

    checkValidationEmail(): void {
      
        if (!this.email) {
            this.errors.push('Email - обязательные поля');
        }
        else {
            return null;
        }
        this.events.emit('form-email-input: validation', this.errors);
    }

    checkValidationPhone(): void {
        if (!this.phone) {
            this.errors.push('Телефон - обязательные поля');
        }
        else {
            return null;
        }
        this.events.emit('form-phone-input: validation', this.errors);
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
