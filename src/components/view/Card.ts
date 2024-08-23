import { IEvents } from '../base/events';
import {cloneTemplate, ensureElement} from "../../utils/utils";
import { Component } from '../base/Component';
import { ICard, ICardBasketData, TCardCategoryType} from '../../types/index';

// Карточка (расширяет класс Модальное окно): имеет обработчик, который выполняется, когда добавляется карточка в корзину, кнопка должна меняться в зависимости от того, находится ли товар в корзине, должна иметь возможность получить все данные по карточке.

export class  CardViewBase extends Component<ICard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);

    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
         this.setText(this._price, value ? `${value.toString()} синапсов` : 'Бесценно');
     }
}

export class CardViewBasket extends CardViewBase {
    protected buttonDelete?: HTMLButtonElement; // кнопка удалить

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this.buttonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.buttonDelete.addEventListener('click', () => {
            this.events.emit('basket: change', { card: this });
        })
    }
}

export class CardViewCardList extends CardViewBase  {
        protected _category?: HTMLElement;
        protected _image?: HTMLImageElement;
        protected CardCategoryType: Record<string, string> = {
            "софт-скил": "_soft",
            "кнопка": "_button",
            "другое": "_other",
            "хард-скил": "_hard",
            "дополнительное": "_additional",
        }

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
    }
    
    set category(value: string) {
        this._category.textContent = value;
        const mapcategory = this._category.classList[0];
        this._category.className = '';
        this._category.classList.add(`${mapcategory}`);
        this._category.classList.add(`${mapcategory}${this.CardCategoryType[value]}`)

    }
    set image(value: string) {
        this._image.src = value;
        this._image.alt = this._title.textContent;
    }

}

export class CardViewPreview extends CardViewBase {
    protected _category?: HTMLElement;
    protected _description?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _buttonChange: HTMLButtonElement;

    protected CardCategoryType: Record<string, string> = {
        "софт-скил": "_soft",
        "кнопка": "_button",
        "другое": "_other",
        "хард-скил": "_hard",
        "дополнительное": "_additional",
    }

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._buttonChange = ensureElement<HTMLButtonElement>('.button', container);

        this._buttonChange.addEventListener('click', () => {
            this.events.emit('basket: change', { card: this });
        })
    }

    set category(value: string) {
        this._category.textContent = value;
        const mapcategory = this._category.classList[0];
        this._category.className = '';
        this._category.classList.add(`${mapcategory}`);
        this._category.classList.add(`${mapcategory}${this.CardCategoryType[value]}`)
    }

    set image(value: string) {
        this._image.src = value;
        this._image.alt = this._title.textContent;
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set buttonChange(text: string) {
        this.setText(this._buttonChange, text);
    }
}











   