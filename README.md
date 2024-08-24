# Проектная работа "Веб-ларек"

Используемый стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/vendor/index.ts — файл с описанием бизнес-логики (PRESENTER)

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Описание проекта "Веб-ларек"
"Веб-ларек" - интернет-магазин. По сути есть главная страница с перечнем товаров и значком корзины и множество модальных окон, которые обеспечивают возможность посмотреть конкретный товар и возможность оформить по нему заказ.
Макет: https://www.figma.com/design/50YEgxY8IYDYj7UQu7yChb/Веб-ларёк?node-id=1-735&t=5o12C686f6mogjbA-0

## Архитектурный паттерн
В качестве паттерна для построения архитектуры приложения (интернет-магазина) выбран MVP (Model-View-Presenter) - паттерн.
MVP разделяет приложение на три основных компонента:
- Модель (Model) — представляет бизнес-логику приложения и данные.
- Представление (View) — отображает данные пользователю и обрабатывает пользовательский ввод.
- Презентер (Presenter) — является посредником между моделью и представлением. Модель и представление взаимодействуют только через презентер.

## Более детальное описание
На главной странице загружаются доступные товары.
На главной странице отображается корзина с указанием количества товаров в ней.
Пользователь может кликнуть по корзине, откроется корзина с данными (название, цена) по товарам, которые в ней находятся.
Пользователь кликом открывает карточку товара для просмотра. Карточка товара содержит идентификатор товара, название товара, описание товара, изображение товара, категорию товара и цену.
Товар можно добавить только один раз, т.е. в процессе попытки добавления товара в корзину необходимо учитывать его возможное наличие в корзине.
После добавления всех товаров в корзину сумма по всем товарам суммируется. Также в корзине имеется возможность удалить любой товар.
ОФОРМЛЕНИЕ ЗАКАЗА ТОВАРА
ВСЕ, что используется при офорлении заказа (включая все, что должно быть заполнено в формах):
- Перечень карточек товара (массив).
- Общая сумма.
- Тип оплаты.
- Адрес доставки.
- Телефон.
- Email.
Далее должны производиться проверка заполненных полей и выбранного способа оплаты; очистка всех полей и выставление базового способа оплаты, очистка корзины.
После этого происходит завершение оформления заказа. В окне успеха завершения заказа отображается сумма по заказу.
API используется для:
- получения с сервера данныех для КАРТОЧКИ ТОВАРА, списка карточек,
- отправления данных по заказу (объект заказа).

## Данные и типы данных, используемые в приложении
КАРТОЧКА ТОВАРА
Тип, который описывает все категории товаров, представленные в макете интернет-магазина
```js
type TCardCategoryType = "софт-скил" | "кнопка" | "другое" | "хард-скил" | "дополнительное";
```
Данные по карточке
```js
interface ICard {
    id: string; //идентификатор товара
    title: string; //название товара
    description: string; //описание товара
    image: string; //изображение товара
    category: TCardCategoryType; //категория товара
    price: number | null; //цена товара
}
```
Массив карточек
```js
interface ICardList {
    items: ICard[];
}
```
Данные карточки, используемые на главной странице
```js
type TCardMainPage = Pick<ICard, '_id' | 'title' | 'image' | 'price' | 'category'>;
```
Данные карточки, используемые в корзине
```js
type TCardBasket = Pick<ICard, '_id' | 'title' | 'price'>;
```
Данные карточки для отправки на сервер при заказе
```js
type TCardBasketOrder = Pick<ICard, '_id'>;
```
Данные карточки, используемые в модальном окне карты: интерфейс ICard

ЗАКАЗ
```js
type TPaymentType = 'card' | 'cach';
interface IOrderForms {
    payment: TPaymentType; //способ оплаты
    address: string; // адрес доставки 
    email: string; //email
    phone: string; //телефон
}
```
Данные заказа, используемые в 1 модальном окне
```js
type TOrderFormPaymentDelivery = Pick<IOrderForms, 'payment' | 'address'>;
```

Данные заказа, используемые в 2 модальном окне
```js
type TOrderFormContacts = Pick<IOrderForms, 'email' | 'phone'>;
```
```js
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
```
Типизируем Коллекции

Коллекция Главная страницва. Перечень карточек на главной странице с учетом отображения карточки в отдельном окне
Модель для хранения данных карточек
```js
interface ICardsData {
    items: ICard[];
    preveiw: string | null; // идентификатор карточки при открытии в отдельном окне
    getCard(): ICard; //получить карточку по id
}
```
Коллекция Корзина
```js
interface ICardBasketData {
    items: TCardBasket[]; //перечень карточек в корзине ?? может, ICard
    getCardListInBasket(): TCardBasket[]; //получить массив карточек, а именно id всех карточек
    getCardListInBasketNumber(): number;  //чтобы число карточек получить для отображения на корзине
    addToBasket(): void; //добавить карточку в корзину, в нем положить карточку в массив, запустить событие, чтобы корзина обновилась, и создать этот товар в корзине
    removeFromBasket(): void; //удалить карточку из массива, вызвать событие изменения массива в корзине, убираем из корзины
    updateCardListInBasket(): TCardBasket[];
    //??возможно добавить метод обновл. карточки
    getTotalPrice(): number; // получить полную сумму заказа
    clearBasketData(): void; //очистить данные корзины после заказа
}
```

## Базовый код
### Класс Api
Содержит в себе базовую логику отправки запросов.
Методы:
- GET: выполняет get запрос на переданный эндпоинт и возвращает промис с объектом, которым ответил сервер.
- POST: принимает объект с данными, которые будут переданы в json в теле запроса и отправляет эти данные на эндпоинт, переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе (код класса написан, просто используем). Класс используется в PRESENTER и слоях приложения для запуска событий.
Основные методы, реализуемые классом описаны интерфейсом 'IEvents':
- on: подписка на событие,
- emit: инициализация события,
- trigger: возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

### Класс Model
В параметры конструктора класса передается интерфейс IEvents. Базовая модель, чтобы можно было отличить ее от простых объектов с данными. Класс описан в учебном проекте Оно, просто используем при необходимости.

### Класс Component
Базовый класс для использования в классах представления VIEW. Класс описан в учебном проекте Оно, просто используем при необходимости.

## MODEL, PRESENTER, VIEW
### MODEL
#### Класс для работы с карточкой
Хранит массив карточек и хранит ту карточку, которую выбрали для просмотра.
Действия с данными.
Нужны методы для того, чтобы:
- получить массив карточек,
- получить 1 карточку с определенным id.
Работу с данными, связанными с добавлением, удалением из корзины, относим в класс Корзины, см. ниже.

Сам класс CardsData (отвечает за хранение и логику работы с данными карточек, скоррее всего будет наследовать базовый класс Model, см. ## Базовый код):
```js
protected  _items;
protected  _preview;
//events из Model

getCard(): ICard; //получить карточку по id, возвращаем данные карточки
//СЕТТЕРЫ И ГЕТТЕРЫ
```
В классе, который реализует interface ICardsData, нужно создать также сеттеры и геттеры для получения и сохранения данных из полей класса:
- сохранения массива картчек и для получения массива карточек, 
- сохранения id и получения id (preview).


#### Класс для работы с заказом
Действия пользователя при работе с формами: Выбрать способ оплаты. Ввести адрес. Ввести телефон. Ввести e-mail. Подтвердить заказ.
Действия с данными. 
Нужны методы для того, чтобы:
- валидировать данные форм,
- очистить данные форм,

Сам класс OrderForms (отвечает за заказ, скоррее всего будет наследовать базовый класс Model, см. ## Базовый код):

```js
protected _payment: TPaymentType = 'card';; //способ оплаты
protected _address: string; // адрес доставки 
protected _email: string; //email
protected _phone: string; //телефон
protected _errors: string[] = [];
//events из Model

checkValidationPaymentDylivery(): void;//валидировать 1 форму, вызвать событие проверки
checkValidationPayment(): void;
checkValidationDylivery(): void;
checkValidationContacts(): void;//валидировать  2 форму,вызвать событие проверки
checkValidationEmail(): void;
checkValidationPhone(): void;
clearOrderForms(): void;//очистить данные форм
//СЕТТЕРЫ И ГЕТТЕРЫ
```
В классе, который реализует interface IOderFormsData, нужно создать также сеттеры и геттеры для получения и сохранения данных из полей класса:
- получение и сохранение выбранного способа оплаты,
- получение и сохранение адреса, почты, телефона.

### Класс Корзина
Работа с данными, которые относятся к корзине, добавлению, удалению товара в корзину.
Нужны методы для того, чтобы:
- получить массив карточек в корзине (id и число карточек),
- удалить или добавить карточку из корзины,
- получить полную сумму,
- очистить данные корзины после заказа.

Сам класс BasketData (отвечает за корзину, скоррее всего будет наследовать базовый класс Model, см. ## Базовый код):
```js
protected _items: TCardBasket[]; //перечень карточек в корзине ?? может, ICard
//events из Model

getCardListInBasket(): TCardBasket[]; //получить массив карточек, а именно id всех карточек)
getCardListInBasketNumber(): number;  //чтобы число карточек получить для отображения на корзине
addToBasket(): void; //добавить карточку в корзину, в нем коложить карточку в массив, запустить событие, чтобы корзина обновилась, и создать этот товар в корзине
removeFromBasket(): void; //удалить карточку из массива, вызвать событие изменения массива в корзине, убираем из корзины
updateCardListInBasket():TCardBasket[];
//??возможно добавить метод обновл. карточки
getTotalPrice(): number; // получить полную сумму заказа
clearBasketData(): void; //очистить данные корзины после заказа
//СЕТТЕРЫ И ГЕТТЕРЫ
```
В классе, который реализует interface ICardBasketData, нужно создать сеттеры и геттеры для:
- сохранения массива картчоек и для получения массива карточек.

### VIEW
Компоненты:
- Модальное окно: открывается при клике, закрывается при нажатии на крестик, пустое поле, esc.  
constructor(container: HTMLElement, events: IEvents)
поля класса: container: HTMLElement, events: IEvents  
методы: 'open' 'close'
- Форма (расширяет класс Модальное окно): имеет обработчик, который будет выполняться, когда сабмитится форма (вызывается, когда нажимается кнопка), может обрабатывать (уметь отображать) ошибки, кнопка должна уметь отключаться или включаться в зависимости от проверки валидности, закрывается при нажатии на кнопку.
- Карточка (расширяет класс Модальное окно): имеет обработчик, который выполняется, когда добавляется карточка в корзину, кнопка должна меняться в зависимости от того, находится ли товар в корзине, должна иметь возможность получить все данные по карточке.
- Корзина (расширяет класс Модальное окно): имеет обработчик, который будет выполняться, когда происходит переход к заполнению форм, должна иметь обработчик, который вызывается, когда товар удаляется из корзины, получает перечень карточек (часть данных по карточкам для их отображения) в зависимости от добавления/ удаления из корзины, должна получать данные по общей сумме заказа.
- Окно Подтверждение заказа (расширяет класс Модальное окно): должно получать общую сумму, при  нажатии на кнопку За новыми покупками окно должно закрываться. При открытии этого окна класс сохраняет в параметрах полученный обработчик, который передается для выполнения при сабмите  форм и корзины ??.
- Класс MainPage - главная страница, отображается все карточк товаров и счетчик количества добавленных в корзину на корзине. Таким образом, Главная страница: должна получать данные всех карточек для отображения (неполные данные), данные числа товаров в корзине для отображения.  
  
В интерфейсах (типах) привязка к элементам HTML.

### PRESENTER
В PRESENTER соединяем MODEL и VIEW воедино. Обеспечиваем взаимодействие с API.  
  
Бизнес-логика:  
  
Открываем страницу.  
Запускаем событие. Отображаем перечень карточек (в компоненте Главная страница), данные берем из Model - класс CardsData, метод getCardList().  
  
Запускаем событие. Отображаем количество товаров в корзине, данные берем из Model класс BasketData, метод getCardListInBasketNumber().  
  
Открываем карточку. По клику. Событие: 'card: selected'  
Запускаем событие. Отображаем данные карточки (передаем в компонент Карточка), данные получаем из CardsData, метод getCard(). Также запускаем событие проверки наличия в корзине класс BasketData ??. Если в корзине есть - отображаем (передаем в компонент Карточка) удалить, если нет - В корзину.
  
Нажимаем В корзину  (если на кнопке текст В корзину). Событие: 'basket: change' 
Запускаем событие.  Добавляем карточку в Model  класс BasketData, метод addToBasket(), обновляем перечень карточек в корзине updateCardListInBasket(), запускаем событие, что карточка в корзине. Отображаем в компоненте Карточка - меняем надпись на кнопке на Удалить.
  
Нажимаем Удалить (если на кнопке текст Удалить) . Событие:'basket: change'  
Запускаем событие. Убираем карточку класс BasketData, метод removeFromBasket(), обновляем перечень карточек в корзине updateCardListInBasket(), запускаем событие, что карточка не в корзине. Отображаем в компоненте Карточка - меняем надпись на кнопке на В корзину.  

Открываем корзину.  Событие: 'basket: open'
Запускаем событие. Отображаем данные корзины (передаем в компонент Корзина), данные получаем из Model класса BasketData getCardListInBasket(). Отображаем общую сумму, данные берем из класса BasketData getTotalPrice().
  
Нажимаем в Корзине на Удалить карточку. Событие: 'basket: change'   
Запускаем событие. Убираем карточку из класс BasketData, метод removeFromBasket(), обновляем перечень карточек в корзине updateCardListInBasket(), запускаем событие, что карточка не в корзине. Отображаем в компоненте Корзина новый перечень. 
  
Нажимаем в Корзине на Оформить. Подтверждаем данные корзины. Событие: 'basket: submit'.
Запускае событие. ??Подтверждаем данные корзины. Запускаем событие  - открыть первую форму (компонент Форма), кнопка Далее неактивна, запускаем событие - передаем данные из компонента Формы в Model класс OrderForms (изменение полей формы), проверяем на валидность, метод checkValidationPaymentDelivery(), передаем данные о валидности в компонент Форма, отображаем ошибки при необходимости. Если валидация пройдена в отображении меняем кнопку на активную в компоненте Форма.
  
Нажимаем в первой форме на Далее. Подтверждаем данные первой формы. Событие: 'form-payment-delivery: submit'  
Запускае событие. ??Подтверждаем данные первой формы. Запускаем событие  - открыть вторую форму (компонент Форма), кнопка Оплатить неактивна, запускаем событие - передаем данные из компонента Формы в Model класс OrderForms (изменение полей формы), проверяем на валидность, метод checkValidationContacts(), передаем данные о валидности в компонент Форма, отображаем ошибки при необходимости. Если валидация пройдена в отображении меняем кнопку на активную в компоненте Форма.
  
Нажимаем Оплатить на второй форме.  Подтверждаем данные второй формы. Событие: 'form-contacts: submit'  
Запускаем событие. Создаем новый заказ. Данные по заказу берем из OderForms и BasketData... Передаем данные по заказу на сервер. Открывам окно успеха.Отображаем полную сумму из BasketData. Обнуляем данные форм и корзины (методы clearBasketData() и clearOrderForms()).

Нажимаем За новыми покупками. Событие: 'order: finish'  
Запускаем событие. Получаем данные с сервера по карточкам. Запускаем метод getCardList() из класса CardsData Model. Передаем данные для отображения в компонент Главная страница.  Запускаем событие. Отображаем количество товаров в корзине, данные берем из Model класс BasketData, метод getCardListInBasketNumber(). 

При открытии  модального окна блокируем прокрутку. При закрытии - снимаем блокировку.

### События
События, которые могут генерироваться в системе:
'cards: changed' - изменение массива карточек
'card: selected' - изменение открываемой в модальном окне карточки
  
События, возникающие при взаимодействии пользлователя с интерфейсом:
'basket: open' - открытие корзины   
'form-payment-delivery: open' - открытие первой формы  
'form-contacts: open' - открытие второй формы  
'edit-payment: change' - изменение способа оплаты  
'edit-email: change' - изменение данных почты  
'edit-address: change' - изменение данных адреса  
'edit-phone: change' - изменение данных телефона  
'basket: submit' - подтверждение данных корзины  
'basket: change' - изменение кол-ва карточек в корзине  
'form-payment-delivery: submit' - подтверждение данных первой формы  
'form-contacts: submit' - подтверждаение данных второй формы  
'form-payment: validation' - событие, необходимость валидации выбора способа оплаты  
'form-address-input: validation' -  событие, валидация поля адреса  
'form-email-input: validation' -  событие,  валидация поля почты  
'form-phone-input: validation' -  событие, валидация  поля телефона
'form-contacts-input: validation' - событие, валидация формы контактов
'form-payment-delivery-input: validation' - событие, валидация формы адрес, способ оплаты
'error: vaidation'
'order: finish' - событие, завершение заказа
'modal: open' - событие открытия моального окна
'modal: close' - событие закрытия модального окна
'basket: addcard'
'basket: removecard'

## Класс взаимодействия с API
Класс, описывающий взаимодействие с API. Используются методы GET и POST.