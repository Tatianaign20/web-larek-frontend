
/**
 * Описываем PRESENTER
 */

import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { AppState } from './components/model/BasketData';
import { WebLarekAPI } from './components/WebLarekAPI';
import { MainPage } from './components/view/MainPage';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { Card } from './components/view/Card';
import { Success } from './components/view/Success';
import { DeliveryPaymentForm } from './components/view/DeliveryPaymentForm';
import { ContactsForm } from './components/view/ContactsForm';
import { BasketItem } from './components/view/BasketItem';
import { ICardList, Events, OderFormErrors, ICard, PaymentType } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';

/**
 * Создаём объекты: api, events
 */
const api = new WebLarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

/**
 * Шаблоны
 */
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

/**
 * Объект Model
 */
const appData = new AppState({}, events);

/**
 * Глобальные view-контейнеры
 */
const page = new MainPage(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

/**
 * части интерфейса, которые переиспользуются
 */
const basket = new Basket(cloneTemplate(basketTemplate), events);
const deliveryPaymentForm = new DeliveryPaymentForm(cloneTemplate(deliveryTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

/**
 * Описываем бизнес-логику
 */

/**
 * Обновили доступные карточки
 */
events.on<ICardList>(Events.LOAD_CARDS, () => {
	// Отрисовываем каждую карточку
	page.galery = appData.cardList.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), events, {
			onClick: () => events.emit(Events.OPEN_CARD, item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

/**
 * Открыли корзину
 */
events.on(Events.OPEN_BASKET, () => {
	modal.render({
		content: basket.render({
			valid: appData.getCardInBasket() > 0 
		}),
	});
});

/**
 * Открыли карточку
 */
events.on(Events.OPEN_CARD, (item: ICard) => {
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), events, {
		onClick: () => {
			if (appData.isCardInBasket(item)) {
				item.removeFromBasket();
			} else {
				item.addToBasket();
			}
			events.emit(Events.OPEN_CARD, item);
		},
	});

	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			button: item.selected ? 'Удалить' : 'Купить',
		}),
	});
});

/**
 * Любые изменения в любой карточке
 */
events.on(Events.CHANGE_CARD_IN_BASKET, () => {
	page.counter = appData.getCardInBasket();

	basket.items = appData.basket.map((item, index) => {
		const card = new BasketItem(cloneTemplate(cardBasketTemplate), events, {
			onClick: (event) => {
				item.removeFromBasket();  // TODO: может стоит вызывать event, а не метод
				events.emit(Events.OPEN_BASKET);
			},
		});
		return card.render({
			index: index,
			title: item.title,
			price: item.price,
		});
	});

	basket.total = appData.getTotalPrice();
});

/**
 * Открываем форму с выбором способа оплаты и полем для ввода адреса
 */
events.on(Events.OPEN_FIRST_ORDER_PART, () => {
	const order = appData.makeOrder();
	modal.render({
		content: deliveryPaymentForm.render({
			payment: order.payment,
			address: order.address,
			valid: false,
			errors: [],
		}),
	});
});

/**
 * Меняется способ оплаты
 */
events.on(Events.SELECT_PAYMENT, (data: { target: string }) => {
	appData.order.payment = data.target as PaymentType;
});

/** 
 * Меняется адрес доставки
 */
events.on(Events.INPUT_ORDER_ADDRESS, (data: { value: string }) => {
	appData.order.address = data.value;
});

/**
 * Меняется электронная почта
 */
events.on(Events.INPUT_ORDER_EMAIL, (data: { value: string }) => {
	appData.order.email = data.value;
});

/**
 * Меняется телефон
 */
events.on(Events.INPUT_ORDER_PHONE, (data: { value: string }) => {
	appData.order.phone = data.value;
});

/**
 * Изменение состояния валидации формы
 */
events.on(Events.VALIDATE_ORDER, (errors: Partial<OderFormErrors>) => {
	// TODO: Лучше разнести
	const { payment, address, email, phone } = errors;
	deliveryPaymentForm.valid = !payment && !address;
	contactsForm.valid = !email && !phone;
	deliveryPaymentForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

/**
 * Заполнили форму оплаты с выбором оплаты и полем для адреса
 */
events.on(Events.FINISH_FIRST_ORDER_PART, () => {
	events.emit(Events.OPEN_SECOND_ORDER_PART);
});

/**
 * Открываем  форму с полями для телефона и email
 */
events.on(Events.OPEN_SECOND_ORDER_PART, () => {
	const order = appData.order;
	modal.render({
		content: contactsForm.render({
			email: order.email,
			phone: order.phone,
			valid: false,
			errors: [],
		}),
	});
});

events.on(Events.FINISH_SECOND_ORDER_PART, () => {
	const order = appData.order;

	api
		.postOrderCards(
			{
				payment: order.payment,
				address: order.address,
				email: order.email,
				phone: order.phone,

				total: appData.getTotalPrice(),
				items: appData.getCardIdInBasket(),
			}
		)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), events, {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
			appData.clearBasket();
		})
		.catch((err) => {
			console.error(err);
		});
});


/** 
 * Блокируем прокрутку страницы при открытии окна
 */
events.on(Events.OPEN_MODAL, () => {
	page.locked = true;
});

/**
 * Убираем блокировку прокрутки страницы при закрытии окна
 */
events.on(Events.CLOSE_MODAL, () => {
	page.locked = false;
});

/**
 * Подгружаем карточки
 */
api
	.getCardList()
	.then((res) => {
		appData.cardList = res;
	})
	.catch(console.error);
