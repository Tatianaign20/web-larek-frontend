import { IEvents } from '../base/events';
import { Form } from './Form';
import { IOrderFormsSecond } from "../../types/index";

// В классе использован код учебного проекта Оно тебе надо

export class OrderFormContactsView extends Form<IOrderFormsSecond> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}


