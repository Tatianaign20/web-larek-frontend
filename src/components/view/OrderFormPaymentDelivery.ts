import { IEvents } from '../base/events';
import {createElement, ensureElement, ensureAllElements} from "../../utils/utils";
import { Form } from './Form';
import { TOrderFormPaymentDelivery } from "../../types/index";

// Форма (расширяет класс Модальное окно): имеет обработчик, который будет выполняться, когда сабмитится форма (вызывается, когда нажимается кнопка), может обрабатывать (уметь отображать) ошибки, кнопка должна уметь отключаться или включаться в зависимости от проверки валидности, закрывается при нажатии на кнопку.
// В классе частично использован код учебного проекта Оно

export class OrderFormPaymentDeliveryView extends Form<TOrderFormPaymentDelivery> {
   protected _buttonsРayment: HTMLButtonElement[];



    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttonsРayment = ensureAllElements(`.button_alt`, container);

        this._buttonsРayment.forEach((buttonРayment) => {
			buttonРayment.addEventListener('click', () => {
				this.buttonsРayment = buttonРayment.name;
				this.onInputChange(`payment`, buttonРayment.name);
			});
            
		});
    }

    set buttonsРayment(name: string) {
		this._buttonsРayment.forEach((buttonsРayment) => {
			this.toggleClass(buttonsРayment, 'button_alt-active', buttonsРayment.name === name);
		});
	}


    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }


    clearbuttonsРayment() {
        this._buttonsРayment.forEach((buttonРayment) => {
            this.toggleClass(buttonРayment, 'button_alt-active', false);
            });
        }
}



