import { IEvents } from '../base/events';
import {cloneTemplate, ensureElement} from "../../utils/utils";
import { Component } from '../base/Component';
import { ICard, ICardBasketData, TCardCategoryType} from '../../types/index';

// Карточка (расширяет класс Модальное окно): имеет обработчик, который выполняется, когда добавляется карточка в корзину, кнопка должна меняться в зависимости от того, находится ли товар в корзине, должна иметь возможность получить все данные по карточке.
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
export class  CardViewBase extends Component<ICard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    
    constructor(container: HTMLElement) {
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
    protected buttonDelete?: HTMLButtonElement; // кнопка удалить;
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this.buttonDelete = container.querySelector('.basket__item-delete');
        this._index = container.querySelector('.basket__item-index');

        // this.buttonDelete.addEventListener('click', () => {
        //     this.events.emit('basket: change', { card: this });
        // })

        if (actions?.onClick) {
            if (this.buttonDelete) {
                this.buttonDelete.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set index(value: number) {  
        this._index.textContent = value.toString();
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

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._category = container.querySelector('.card__category');
        this._image = container.querySelector('.card__image');

        if (actions?.onClick) {
            if (this.image) {
                this._image.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
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

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._category = container.querySelector('.card__category');
        this._description = container.querySelector('.card__text');
        this._image = container.querySelector('.card__image');
        this._buttonChange = container.querySelector('.button');

        // this._buttonChange.addEventListener('click', () => {
        //     this.events.emit('basket: change', { card: this });
        // })

        if (actions?.onClick) {
            if (this._buttonChange) {
                this._buttonChange.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
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











   