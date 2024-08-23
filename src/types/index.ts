
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
}

// Массив карточек
interface ICardList {
    items: ICard[];
}

// Данные карточки, используемые на главной странице
type TCardMainPage = Pick<ICard, 'id' | 'title' | 'image' | 'price' | 'category'>;

// Данные карточки, используемые в корзине
type TCardBasket = Pick<ICard, 'id' | 'title' | 'price' >;

//Данные карточки для отправки на сервер при заказе
type TCardBasketOrder = Pick<ICard, 'id'>;

// Данные карточки, используемые в модальном окне карты: интерфейс ICard

//ЗАКАЗ
type TPaymentType = 'card' | 'cach';

interface IOrderForms {
    payment: TPaymentType | string; //способ оплаты
    address: string; // адрес доставки 
    email: string; //email
    phone: string; //телефон
}


// Данные заказа, используемые в 1 модальном окне
type TOrderFormPaymentDelivery = Pick<IOrderForms, 'payment' | 'address'>;

// Данные заказа, используемые в 2 модальном окне
type TOrderFormContacts = Pick<IOrderForms, 'email' | 'phone'>;

interface IOderFormsData {
    payment: TPaymentType; //способ оплаты
    address: string; // адрес доставки 
    email: string; //email
    phone: string; //телефон
    checkValidationPaymentDylivery(): void;//валидировать 1 форму, вызвать событие проверки
    checkValidationPayment(): void;
    checkValidationDylivery(): void;
    checkValidationContacts(): void;//валидировать  2 форму,вызвать событие проверки
    checkValidationEmail(): void;
    checkValidationPhone(): void;
    clearOrderForms(): void;//очистить данные форм
}

// Типизируем Коллекции
// Коллекция Главная страницва. Перечень карточек на главной странице с учетом отображения карточки в отдельном окне
// Модель для хранения данных карточек
interface ICardsData {
    items: ICard[];
    preveiw: string | null; // идентификатор карточки при открытии в отдельном окне
    getCard(): ICard; //получить карточку по id
 }


//Коллекция Корзина
interface ICardBasketData {
    items: TCardBasket[]; //перечень карточек в корзине ?? может, ICard
    getCardListInBasket(): TCardBasket[]; //получить массив карточек, а именно id всех карточек)
    getCardListInBasketNumber(): number;  //чтобы число карточек получить для отображения на корзине
    addToBasket(): void; //добавить карточку в корзину, в нем коложить карточку в массив, запустить событие, чтобы корзина обновилась, и создать этот товар в корзине
    removeFromBasket(): void; //удалить карточку из массива, вызвать событие изменения массива в корзине, убираем из корзины
    updateCardListInBasket():TCardBasket[];
    getTotalPrice(): number; // получить полную сумму заказа
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
    TPaymentType,
    IOrderForms,
    TOrderFormPaymentDelivery,
    TOrderFormContacts,
    IOderFormsData,
    ICardsData,
    ICardBasketData,
    IOrder,
    IOrderResult
}