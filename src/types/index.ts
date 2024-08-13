// MODEL
// Содержит следующие глобальные сущности: КАРТОЧКА ТОВАРА, ЗАКАЗ, описание приложения (AppState)
//КАРТОЧКА ТОВАРА
//Тип, который описывает все категории товаров, представленные в макете интернет-магазина
type CardCategoryType = 'софт-скил' | 'кнопка' | 'другое' | 'хард-скил' | 'дополнительное';

//Эти данные по карточке товара мы базово получаем с сервера
interface IСardApi {
    //Данные, связанные с карточкой товара
    id: string; //идентификатор товара
    description: string; //описание товара
    image: string; //изображение товара
    title: string; //название товара
    category: CardCategoryType; //категория товара
    price: number | null; //цена товара
}

//У нас должны быть данные, связанные с корзиной по товару, т.к. товар мы можем добавить только один раз
interface ICardBasket {
    selected: boolean; //значение выбора
    // Действия, связанные с карточкой товара
    addToBasket(): void; //метод добавления в корзину
    removeFromBasket(): void; //метод удаления из корзины
    }

// Тогда в целом описание карточки по товару должно выглядеть следующим образом:
interface ICard extends IСardApi, ICardBasket {}

// Тип, который описывает все возможные варианты оплаты товаров
type PaymentType = 'card' | 'cash'; 
//Заполняем две формы
interface IOrderDeliveryPaymentForm {
	payment: PaymentType; //способ оплаты
	address: string; // адрес доставки
}

interface IOrderContactsForm {
    email: string; //email пользователя
    phone: string; //телефон пользователя
}

//Полная форма (включает 2 формы)
interface IOrderCommonForm extends IOrderDeliveryPaymentForm, IOrderContactsForm {}

//Тогда итоговый интерфейс оформления заказа:
interface IOderForm extends IOrderCommonForm {
    items: ICard[]; //перечень карточек в корзине (в postman items)
    validateOderForm(): void; //функция проверки корректности введенных пользователем данных
    validateEmail(): void; //функция проверки корректности введенных пользователем данных - email
    validatePhone(): void; //функция проверки корректности введенных пользователем данных - номера телефона
    validatePayment(): void; //функция проверки корректности выбора способа оплаты - онлайн или при получении
    validateAddress(): void;//функция проверки корректности введенных пользователем данных - адрес
    clearOderForm(): void; //очистка формы
    submitOder(): void; //завершение оформления
}

//В случае ошибки
type OderFormErrors = Partial<Record<keyof IOrderCommonForm, string>>;

//Интерфейс для отправки данных на сервер:

interface IOrderAPI extends IOrderCommonForm{
    items: string[]; // покупаемые товары
	total: number; // общая сумма заказа
}

//Интерфейс для состояния приложения
interface IAppState {
    cardList: ICard[]; //перечень карточек
    selectCard: ICard; //карточка при открытии
    order: IOderForm; //заказ
    basket: ICard[]; //перечень карточек в корзине
    total: number; //общая сумма заказа
    isCardInBasket(): boolean;//метод для проверки наличия в корзине (вернуть значение, выбрана ли карточка (selected))
    getCardInBasket(): number;//метод получить количество карточек в корзине
    getCardIdInBasket(): number;//метод получить id карточек в корзине
    getTotalPrice(): number;//метод отобразить сумму заказа по всем карточкам в корзине, меняется в зависимости от доб./удаления карточек
    makeOrder(): void;//метод сдеалть заказ
    clearBasket(): void;//метод очистить данные корзины после подтверждения оформления заказа
}

// Описание одной карточкив корзине
type BasketItem = Pick<ICard, "id" | "title" | "price">

//После оформления заказа мы получаем данные с сервера для отображения на странице карточек, интерфейс
interface ICardList {
    cardList: ICard[]; //перечень карточек
}


// Используемые события
enum Events {
	LOAD_CARDS = "cardlist:changed", // подгружаем доступные товары
	OPEN_CARD = "card:open", // открываем карточку для просмотра
	OPEN_BASKET = "basket:open", // открываем корзину
	CHANGE_CARD_IN_BASKET = "card:changed", // добавляем/удаляем товар из корзины
	VALIDATE_ORDER = "formErrors:changed", // проверяем форму отправки
	OPEN_FIRST_ORDER_PART = "order_payment:open", // начинаем оформление заказа
	FINISH_FIRST_ORDER_PART = "order:submit", // заполнили первую форму
	OPEN_SECOND_ORDER_PART = "order_contacts:open", // продолжаем оформление заказа
	FINISH_SECOND_ORDER_PART = "contacts:submit", // заполнили форму
	PLACE_ORDER = "order:post", // завершаем заказ
	SELECT_PAYMENT = "payment:changed", // выбираем способ оплаты
	INPUT_ORDER_ADDRESS = "order.address:change", // изменили адрес доставки
	INPUT_ORDER_EMAIL = "contacts.email:change", // изменили почту 
	INPUT_ORDER_PHONE = "contacts.phone:change", // изменили телефон 
	OPEN_MODAL = "modal:open", // блокировка при открытии модального окна
	CLOSE_MODAL = "modal:close", // снятие блокировки при закрытии модального окна
}


export {
    CardCategoryType,
    IСardApi,
    ICardBasket,
    ICard,
    PaymentType,
    IOrderDeliveryPaymentForm,
    IOrderContactsForm,
    IOrderCommonForm,
    IOderForm,
    OderFormErrors,
    IOrderAPI,
    IAppState,
    BasketItem,
    ICardList,
    Events
}
