import { Model } from '../base/model';
import { IOderFormsData, TOrderFormPaymentDelivery, TOrderFormContacts,IOrderForms, FormErrors } from '../../types/index';
// import { validate } from 'webpack';


export interface IOrderFormsSecond {
    email: string;
    phone: string;
}

export interface IOrderFormsFirst {
    payment: string;
	address: string;
}

export class OrderForms extends Model <IOderFormsData> {
    formErrors: FormErrors = {};
    orderfirst: IOrderFormsFirst = {
        payment: '',
        address: ''
    }
    ordersecond: IOrderFormsSecond = {
        email: '',
        phone: ''
    };
    //events из Model

    
    // Использован код учебного проекта для валидации
    setOrderFieldFirst(field: keyof IOrderFormsFirst, value: string) {
        this.orderfirst[field] = value;

        if (this.validateOrderFirst()) {
            this.events.emit('orderfirst:ready', this.orderfirst);
        }
    }

    // Использован код учебного проекта для валидации
    validateOrderFirst() {
        const errors: typeof this.formErrors = {};
        if (!this.orderfirst.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.orderfirst.address) {
            errors.address = 'Необходимо указать адресс доставки';
        }
        this.formErrors = errors;
        this.events.emit('formErrorsFirst:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }


    // Использован код учебного проекта для валидации
    setOrderFieldSecond(field: keyof IOrderFormsSecond, value: string) {
        this.ordersecond[field] = value;

        if (this.validateOrderSecond()) {
            this.events.emit('ordersecond:ready', this.ordersecond);
        }
    }

    // Использован код учебного проекта для валидации
    validateOrderSecond() {
        const errors: typeof this.formErrors = {};
        if (!this.ordersecond.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.ordersecond.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrorsSecond:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

   clearorderfirst() {
          this.orderfirst = {
             payment: '',
             address: ''
          };
  }
  clearordersecond() {
    this.ordersecond = {
       email: '',
       phone: ''
    };
}

}
