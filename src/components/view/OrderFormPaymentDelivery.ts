import { IEvents } from '../base/events';
import {createElement, ensureElement} from "../../utils/utils";
import { Form } from './Form';
import { TOrderFormPaymentDelivery } from "../../types/index";

// Форма (расширяет класс Модальное окно): имеет обработчик, который будет выполняться, когда сабмитится форма (вызывается, когда нажимается кнопка), может обрабатывать (уметь отображать) ошибки, кнопка должна уметь отключаться или включаться в зависимости от проверки валидности, закрывается при нажатии на кнопку.
// В классе частично использован код учебного проекта Оно

export class OrderFormPaymentDeliveryView extends Form<TOrderFormPaymentDelivery> {
   protected _button_delivery_cash: HTMLButtonElement;
   protected _button_delivery_card: HTMLButtonElement;



    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._button_delivery_cash = container.querySelector('cash');
        this._button_delivery_card = container.querySelector('card');

        // this._button_delivery_cash.addEventListener('click', () => {
		// 	// this.setPayment();
        //     this.events.emit('payment: change', { payment: 'cash' });
        // });
        // this._button_delivery_card.addEventListener('click', () => {
        //     // this.setPayment();
        //     this.events.emit('payment: change', { payment: 'card' });
        // });

    }
//  передается кнопка, которую нажали, если кнопка нажата то переключаем класс
	// setPayment() {
			
	// 	};


    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
//установить значение кнопки , при нажатии на разные кнопки
//  set payment(value: TPaymentType) {
//     this.toggleClass
//     }


}


