
//КАРТОЧКА ТОВАРА
//Тип, который описывает все категории товаров, представленные в макете интернет-магазина
type TCardCategoryType = "софт-скил" | "кнопка" | "другое" | "хард-скил" | "дополнительное";

//КАРТОЧКА ТОВАРА
// Данные по карточке
interface ICard {
    id: string; //идентификатор товара
    title: string; //название товара
    description: string; //описание товара
    image: string; //изображение товара
    category: TCardCategoryType | string; //категория товара
    price: number | null; //цена товара
    index?: number; //??
}

// Массив карточек
interface ICardList {
    items: ICard[];
}

// Данные карточки, используемые на главной странице
type TCardMainPage = Pick<ICard, 'id' | 'title' | 'image' | 'price' | 'category'>;

// Данные карточки, используемые в корзине
type TCardBasket = Pick<ICard, 'id' | 'title' | 'price' | 'index'>; //??

//Данные карточки для отправки на сервер при заказе
type TCardBasketOrder = Pick<ICard, 'id'>;

// Данные карточки, используемые в модальном окне карты: интерфейс ICard

//ЗАКАЗ

interface IOrderForms {
    payment: string; //способ оплаты
    address: string; // адрес доставки 
    email: string; //email
    phone: string; //телефон
}

type FormErrors = Partial<Record<keyof IOrderForms, string>>;

// Данные заказа, используемые в 1 модальном окне
interface IOrderFormsFirst {
    payment: string;
	address: string;
}

// Данные заказа, используемые в 2 модальном окне
interface IOrderFormsSecond {
    email: string;
    phone: string;
}

interface IOderFormsData {
    formErrors: FormErrors;
    setOrderFieldFirst(): void;
    setOrderFieldSecond(): void;
    validateOrderFirst(): void;
    validateOrderSecond(): void;
    clearorderfirst(): void;
    clearordersecond(): void;
}

// Типизируем Коллекции
// Коллекция Главная страницва. Перечень карточек на главной странице с учетом отображения карточки в отдельном окне
// Модель для хранения данных карточек
interface ICardsData {
    items: ICard[];
    preveiw: string | null; // идентификатор карточки при открытии в отдельном окне
    getCard(): ICard; //получить карточку по id
    getCardList(): ICard[]; //получить массив карточек
 }


//Коллекция Корзина
interface ICardBasketData {
    items: TCardBasket[]; //перечень карточек в корзине ?? может, ICard
    getCardListInBasket(): TCardBasket[]; //получить массив карточек, а именно id всех карточек)
    getCardListInBasketNumber(): number;  //чтобы число карточек получить для отображения на корзине
    addToBasket(): void; //добавить карточку в корзину
    removeFromBasket(): void; //удалить карточку из массива
    getTotalPrice(): number; // получить полную сумму заказа
    inBasket(): void;
    clearBasketData(): void; //очистить данные корзины после заказа
}

// Коллекция Заказ
interface IOrder extends IOrderForms {
    items: string[]; //перечень карточек в корзине ?? может, ICard
    total: number;
}

interface IOrderResult {
    id: string;
    total: number;
}

export {
    TCardCategoryType,
    ICard,
    ICardList,
    TCardMainPage,
    TCardBasket,
    TCardBasketOrder,
    IOrderForms,
    IOderFormsData,
    ICardsData,
    ICardBasketData,
    IOrder,
    IOrderResult,
    FormErrors,
    IOrderFormsSecond,
    IOrderFormsFirst
}