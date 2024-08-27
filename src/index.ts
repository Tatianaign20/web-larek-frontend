import './scss/styles.scss';
import { EventEmitter } from "./components/base/events";
import { IEvents } from './components/base/events';
import { CardsData } from "./components/model/CardsData";
import { BasketData } from "./components/model/BasketData";
import { OrderForms, IOrderFormsSecond, IOrderFormsFirst } from "./components/model/OrderForms";
import { ICard, ICardList, TCardBasket, IOrderForms} from './types';
import { API_URL, CDN_URL } from "./utils/constants";
import { APIweblarek } from "./components/APIweblarek";
import { Modal } from "./components/view/Modal";
import { CardViewBase, CardViewBasket, CardViewCardList, CardViewPreview } from "./components/view/Card";
import { BasketView } from "./components/view/Basket";
import { OrderFormContactsView } from "./components/view/OrderFormContacts";
import { OrderFormPaymentDeliveryView } from "./components/view/OrderFormPaymentDelivery";
import { MainPage } from "./components/view/MainPage";
import { cloneTemplate, ensureElement } from './utils/utils';
import { SuccessOrder } from './components/view/SuccessOrder';

const events = new EventEmitter();
const api = new APIweblarek(CDN_URL, API_URL);

const cardviewlistTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardviewpreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardviewbasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketviewTemplate = ensureElement<HTMLTemplateElement>('#basket');
const delpayviewTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsviewTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const success = ensureElement<HTMLTemplateElement>('#success');

// Из Model
const cardsData = new CardsData({}, events);
const basketData = new BasketData({}, events);
const orderForms = new OrderForms({}, events);

// // //Из View
const mainpage = new MainPage(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new BasketView(cloneTemplate(basketviewTemplate), events);
const deliverypayment  = new OrderFormPaymentDeliveryView(cloneTemplate(delpayviewTemplate ), events);
const contacts = new OrderFormContactsView(cloneTemplate(contactsviewTemplate), events);
const successView = new SuccessOrder(cloneTemplate(success), events);

//Запускаем событие. Отображаем перечень карточек (в компоненте Главная страница), данные берем из Model - класс CardsData, метод getCardList().  

events.on<ICardList>('cards: changed', () => {
    mainpage.catalog = cardsData.getCardList().map(item => {
        const card = new CardViewCardList(cloneTemplate(cardviewlistTemplate), {
            onClick: () => events.emit('card: selected', item)});
        return card.render(item);
    });
});

events.on('card: selected', (item: ICard) => {
    // cardsData.getCard(item.id);
    
    const cardpreview = new CardViewPreview(cloneTemplate(cardviewpreviewTemplate),  {onClick: () => {
        if(basketData.inBasket(item.id)) {
            basketData.removeFromBasket(item.id);
            cardpreview.buttonChange = 'В корзину';
            // mainpage.counter = basketData.getCardListInBasketNumber();
            // events.emit('basket: addcard', item);
        } else {
            basketData.addToBasket(item);
            cardpreview.buttonChange = 'Удалить из корзины';
            // mainpage.counter = basketData.getCardListInBasketNumber();
            // events.emit('basket: removecard', item);
        }
        mainpage.counter = basketData.getCardListInBasketNumber();
      },
    });
    cardpreview.buttonChange = basketData.inBasket(item.id) ? 'Удалить из корзины' : 'В корзину';
    console.log(basketData.inBasket(item.id));
    modal.render({content: cardpreview.render(item)});
    //как сохранить название на кнопке?
})


events.on('basket: open', () => {
    const basketitems = basketData.items.map((item, index) => {
        const basketitem = new CardViewBasket(cloneTemplate(cardviewbasketTemplate), {
            onClick: () => events.emit('basket: removecard', item)
          })
          basketitem.index = index + 1
          return basketitem.render(item);
    });
    modal.render({content: basket.render({
        items: basketitems,
        total: basketData.getTotalPrice(),
    })})
})



events.on('basket: removecard', (item: TCardBasket) => {
    basketData.removeFromBasket(item.id);
    basketData.getTotalPrice();
    const basketitems = basketData.items.map((item, index) => {
        const basketitem = new CardViewBasket(cloneTemplate(cardviewbasketTemplate), {
            onClick: () => events.emit('basket: removecard', item)
          })
          basketitem.index = index + 1
          return basketitem.render(item);
    });
    mainpage.counter = basketData.getCardListInBasketNumber();
    modal.render({content: basket.render({
        items: basketitems,
        total: basketData.getTotalPrice(),
    })})
})
events.on('basket: submit', () => {
	events.emit('form-payment-delivery: open');
});

// Изменилось состояние валидации формы
events.on('formErrorsFirst:change', (errors: Partial<IOrderForms>) => {
    const { payment, address } = errors;
    deliverypayment.valid = !payment && !address;
    deliverypayment.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderFormsFirst, value: string }) => {
    orderForms.setOrderFieldFirst(data.field, data.value);
});

events.on('form-payment-delivery: open', () => {
    modal.render({ content: deliverypayment.render({
        payment: '',
          address: '',
          valid: false,
          errors: []
        }),
    });
  });

events.on('order:submit', () => {
	events.emit('form-contacts: open');
});

// Изменилось состояние валидации формы
events.on('formErrorsSecond:change', (errors: Partial<IOrderFormsSecond>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderFormsSecond, value: string }) => {
    orderForms.setOrderFieldSecond(data.field, data.value);
});


events.on('form-contacts: open', () => {
    basketData.getTotalPrice();
    console.log(basketData.getTotalPrice());
    basketData.getCardListInBasket();
    console.log(basketData.getCardListInBasket());
    modal.render({content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        }
    )});
})

events.on('contacts:submit', () => {
    api.postOrderCardsApi({
        payment: orderForms.orderfirst.payment,
        address: orderForms.orderfirst.address,
        email: orderForms.ordersecond.email,
        phone: orderForms.ordersecond.phone,
        total: basketData.getTotalPrice(),
        items: basketData.getCardListInBasket(),
    })
    .then((res) => {
        events.emit('success:close', res);
        modal.render({content: successView.render({
            content: res.total
         })});
        orderForms.clearorderfirst();
        orderForms.clearordersecond();
        basketData.clearBasketData();
        mainpage.counter = 0;
    })
    .catch(console.error);
});

events.on('success:close', () => {
    modal.close();
})


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    mainpage.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    mainpage.locked = false;
});


// ЧАСТЬ с API работает
api.getCardsListApi()
    .then((res) => {
		cardsData.items = res;
        console.log(cardsData.items);
	})
	.catch(console.error);

api.getCardApi("854cef69-976d-4c2a-a18c-2aa45046c390")
    .then((res) => {
        console.log(res);
    })
    .catch(console.error);

