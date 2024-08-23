import { IEvents } from '../base/events';
import { Form } from './Form';
import { TOrderFormContacts } from "../../types/index";

// Форма (расширяет класс Модальное окно): имеет обработчик, который будет выполняться, когда сабмитится форма (вызывается, когда нажимается кнопка), может обрабатывать (уметь отображать) ошибки, кнопка должна уметь отключаться или включаться в зависимости от проверки валидности, закрывается при нажатии на кнопку.
// В классе использован код учебного проекта Оно

export class OrderFormContactsView extends Form<TOrderFormContacts> {
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


