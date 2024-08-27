import { IEvents } from '../base/events';
import {createElement, ensureElement} from "../../utils/utils";
import { Component } from '../base/Component';

// Корзина

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class BasketView extends Component<IBasketView> {
    protected _title: HTMLElement;
    protected _cardListBasket: HTMLElement;
    protected _basketButton: HTMLButtonElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._title = ensureElement<HTMLElement>('.modal__title', container);
        this._cardListBasket = ensureElement<HTMLElement>('.basket__list', container);
        this._basketButton = ensureElement<HTMLButtonElement>('.basket__button', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket: submit');
        })

        this.items = [];
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    set cardListBasket(value: HTMLElement[]) {
        this.items = value;
    }

    set items(items: HTMLElement[]) {
        if(items.length) {
            this._cardListBasket.replaceChildren(...items);
            this._basketButton.removeAttribute('disabled')}
        else {
            this._basketButton.setAttribute('disabled', 'disabled');
            this._cardListBasket.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                  textContent: 'В корзине нет товаров'
                }));
        }; 
    }


    getnewindexlist() {
        Array.from(this._cardListBasket.children).forEach((item, index) =>
          (item.querySelector(`.basket__item-index`)!.textContent = (index + 1).toString()));
      }
}
    









   