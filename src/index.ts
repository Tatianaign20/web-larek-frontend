import './scss/styles.scss';
import { EventEmitter } from "./components/base/events";
import { IEvents } from './components/base/events';
import { CardsData } from "./components/model/CardsData";
import { BasketData } from "./components/model/BasketData";
import { OrderForms } from "./components/model/OrderForms";
import { ICard, IOrder, TPaymentType, ICardsData, ICardList} from './types';
import {API_URL, CDN_URL} from "./utils/constants";
import { APIweblarek } from "./components/APIweblarek";
import { Modal } from "./components/view/Modal";
import { CardViewBase, CardViewBasket, CardViewCardList, CardViewPreview } from "./components/view/Card";
import { BasketView } from "./components/view/Basket";
import { OrderFormContactsView } from "./components/view/OrderFormContacts";
import { OrderFormPaymentDeliveryView } from "./components/view/OrderFormPaymentDelivery";
import { MainPage } from "./components/view/MainPage";
import { cloneTemplate, ensureElement } from './utils/utils';
import { template } from 'lodash';
import { SuccessOrder } from './components/view/SuccessOrder';

const events = new EventEmitter();
const api = new APIweblarek(CDN_URL, API_URL);

const cardviewlist = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardviewpreview = ensureElement<HTMLTemplateElement>('#card-preview');
const cardview = ensureElement<HTMLTemplateElement>('#card-basket');
const basketview = ensureElement<HTMLTemplateElement>('#basket');
const deliverypaymentview = ensureElement<HTMLTemplateElement>('#order');
const contactsview = ensureElement<HTMLTemplateElement>('#contacts');
const success = ensureElement<HTMLTemplateElement>('#success');

// Из Model
const cardsData = new CardsData({}, events);
const basketData = new BasketData({}, events);
const orderForms = new OrderForms({}, events);

// //Из View
const mainpage = new MainPage(document.body, events);
const modal = new Modal(document.querySelector('#modal-container'), events);
const basket = new BasketView(cloneTemplate(basketview), events);
const deliverypayment  = new OrderFormPaymentDeliveryView(cloneTemplate(deliverypaymentview ), events);
const contacts = new OrderFormContactsView(cloneTemplate(contactsview), events);
// const successView = new SuccessOrder(ensureElement<HTMLElement>('#success'), events);


// events.on<ICardList>('cards: changed', () => {
//     mainpage.catalog = cardsData.items.map(item => {
//         const card = new CardViewCardList(cloneTemplate(cardviewlist),  {
//             onClick: () => events.emit('card:selected', item)});
//         return card.render({
//             title: item.title,
//             image: item.image,
//             description: item.description,
//             category: item.category,
//             price: item.price,
//         });
//     });
// });



const ordertest: IOrder = {
    "payment": 'card', 
    "address": "Spb Vosstania 1",
    "email": "test@test.ru",
    "phone": "+71234567890",
    "total": 2200,
    "items": ["854cef69-976d-4c2a-a18c-2aa45046c390",  "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"]
}


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

api.postOrderCardsApi(ordertest)
    .then((res) => {
        console.log(res);
    })
    .catch(console.error);































    // const modal = new Modal(document.querySelector('#modal-container'), events);

// // //     const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
// // // const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');



// // const gallery = document.querySelector('.gallery');
// // const cardmin = new CardViewBase(cloneTemplate(cardview));
// // const cardBasket = new CardViewBasket(cloneTemplate(cardview), events);
// // const cardList = new CardViewCardList(cloneTemplate(cardviewlist));

// const cardPreview = new CardViewPreview(cloneTemplate(cardviewpreview), events);
// // const cardPreview = new CardViewPreview(cloneTemplate(cardview), events);

// // gallery.append(cardmin.render({price: 123, title: 'test'})); //работает
// // gallery.append(cardBasket.render({price: 123, title: 'test'})); //работает

// // gallery.append(cardList.render({price: 123, title: 'test', category: 'другое'})); //работает

// // gallery.append(cardPreview.render({price: 123, title: 'test', category: 'другое', description: 'test'})); //работает


// const basketfull = new BasketView(cloneTemplate(basketview), events);

// // modal.render({content: basketfull.render()});
// // modal.render({content: basketfull.render()});




// const formview = ensureElement<HTMLTemplateElement>('#contacts');
// const formview2 = ensureElement<HTMLTemplateElement>('#order'); 


// const formContacts = new OrderFormContactsView(cloneTemplate(formview), events);
// const formDelivery = new OrderFormPaymentDeliveryView(cloneTemplate(formview2), events);

// const ordertestContacts = {
//     "phone": "+71234567890",
//     "email": "test@test.ru",
//     valid: true,
//     errors: ['']
// }
// const ordertestDelivery = {

//     "address": "Spb Vosstania 1",
//     valid: true,
//     errors: ['']

// }

// modal.render({content: formContacts.render(ordertestContacts)});





// // modal.render({content: formContacts.render(ordertestContacts)});
// // modal.render({content: formDelivery.render(ordertestDelivery)});

// // modal.render({content: formDelivery.render(ordertestDelivery)});





// // modal.render({content: formContacts.render(bbb)});


// // events.on('cards: changed', () => {
// // cardsData.items.forEach((item) => {
// //     const cardnew = new CardViewBase(cloneTemplate(cardview));
// //     gallery.append(cardnew.render(item));
// // });
// // })

