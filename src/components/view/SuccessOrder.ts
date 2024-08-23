import { IEvents } from '../base/events';
import {ensureElement} from "../../utils/utils";
import { Component } from '../base/Component';


interface ISuccess {
    content: number;
}

export class SuccessOrder extends Component<ISuccess> {
    protected _title: HTMLElement;
    protected _content: HTMLElement;
    protected _button_continue: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._title = ensureElement<HTMLElement>('.order-success__title', container);
        this._content = ensureElement<HTMLElement>('.order-success__description', container);
        this._button_continue = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this._button_continue.addEventListener('click', () => {
            this.events.emit('success: close');
        });
    }

    set content(value: HTMLElement) {
        this.setText(this._content, `Списано ${this.content} синапсов`);
    }
    set title(value: string) {
        this.setText(this._title, value);
    }

}

