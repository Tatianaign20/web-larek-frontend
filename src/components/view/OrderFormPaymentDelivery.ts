import { IEvents } from '../base/events';
import {createElement, ensureElement, ensureAllElements} from "../../utils/utils";
import { Form } from './Form';
import { IOrderFormsFirst } from "../../types/index";

// В классе частично использован код учебного проекта Оно тебе надо

export class OrderFormPaymentDeliveryView extends Form<IOrderFormsFirst> {
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



