import './scss/styles.scss';
import { EventEmitter } from "./components/base/events";
import { IEvents } from './components/base/events';
import { CardsData } from "./components/model/CardsData";
import { BasketData } from "./components/model/BasketData";
import { OrderForms } from "./components/model/OrderForms";
import { ICard, IOrder, TPaymentType, ICardsData, ICardList, TCardBasket, IOrderForms, IOderFormsData} from './types';
import { API_URL, CDN_URL } from "./utils/constants";
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
// const successView = new SuccessOrder(ensureElement<HTMLElement>('#success'), events);

//Запускаем событие. Отображаем перечень карточек (в компоненте Главная страница), данные берем из Model - класс CardsData, метод getCardList().  

events.on<ICardList>('cards: changed', () => {
    mainpage.catalog = cardsData.getCardList().map(item => {
        const card = new CardViewCardList(cloneTemplate(cardviewlistTemplate), {
            onClick: () => events.emit('card: selected', item)});
        return card.render(item);
    });
});


//Запускаем событие. Отображаем количество товаров в корзине, данные берем из Model класс BasketData, метод getCardListInBasketNumber().   ??

//Открываем карточку. По клику. Событие: 'card: selected'  
// Запускаем событие. Отображаем данные карточки (передаем в компонент Карточка), данные получаем из CardsData, метод getCard(). Также запускаем событие проверки наличия в корзине класс BasketData ??. Если в корзине есть - отображаем (передаем в компонент Карточка) удалить, если нет - В корзину.

// events.on('card: selected', (item: ICard) => {
//     cardsData.getCard(item.id);
//     const cardpreview = new CardViewPreview(cloneTemplate(cardviewpreviewTemplate),  {onClick: () => {
//         events.emit('basket: change', item);
//         cardpreview.buttonChange =
//         basketData.getCardListInBasket().indexOf(item.id) !== -1
// 					? 'Удалить из корзины'
// 					: 'Добавить в корзину';
//       },
//     });
//     modal.render({content: cardpreview.render(item)});
// })




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

events.on('form-payment-delivery: open', () => {
    modal.render({ content: deliverypayment.render({
          address: '',
          valid: false,
          errors: []
        }),
    });
  });
  

  events.on('edit-payment: change', (data: { target: string }) => {
    // выбирается кнопка оплаты
    orderForms.payment = data.target as TPaymentType;
  });

events.on('edit-address: change', (data: { value: string }) => {
	orderForms.address = data.value;
});

// Изменилось состояние валидации формы
events.on('form-payment-delivery: validation', (errors: Partial<IOrderForms>) => {
    const { payment, address } = errors;
    deliverypayment.valid = !payment && !address;
    deliverypayment.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

events.on('form-payment-delivery: submit', () => {
	events.emit('form-contacts: open' );
});

events.on('form-contacts: open', () => {

    modal.render({content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        }
    )});
})

events.on('edit-email: change', (data: { value: string }) => {
	contacts.email = data.value;
});
events.on('edit-phone: change', (data: { value: string }) => {
	contacts.phone = data.value;
});

events.on('form-payment-delivery: validation', (errors: Partial<IOrderForms>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});




// // отображение карточки
// events.on('card: selected', (item: ICard) => {
//     cardsData.getCard(item.id);
//         const card = new CardViewPreview(cloneTemplate(cardviewpreview), {
//             onClick: () => {
//               events.emit('basket: change', item)
//             }
//         });
//         modal.render({content: card.render({
//             id: item.id,
//             title: item.title,
//             image: item.image,
//             category: item.category,
//             description: item.description,
//             price: item.price,
//           })});
// });









// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    mainpage.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    mainpage.locked = false;
});




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










//     // const modal = new Modal(document.querySelector('#modal-container'), events);

// const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
// // // // const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');




// // const cardmin = new CardViewBase(cloneTemplate(cardview));
// // // const cardBasket = new CardViewBasket(cloneTemplate(cardview), events);
// const cardList = new CardViewCardList(cloneTemplate(cardviewlist), events);

// // const cardPreview = new CardViewPreview(cloneTemplate(cardviewpreview), events);
// // // const cardPreview = new CardViewPreview(cloneTemplate(cardview), events);

// // // gallery.append(cardmin.render({price: 123, title: 'test'})); //работает
// // // gallery.append(cardBasket.render({price: 123, title: 'test'})); //работает

// gallery.append(cardList.render({price: 123, title: 'test', category: 'другое'})); //работает

// // // gallery.append(cardPreview.render({price: 123, title: 'test', category: 'другое', description: 'test'})); //работает






// // const basketfull = new BasketView(cloneTemplate(basketview), events);

// // // modal.render({content: basketfull.render()});
// // // modal.render({content: basketfull.render()});




// // const formview = ensureElement<HTMLTemplateElement>('#contacts');
// // const formview2 = ensureElement<HTMLTemplateElement>('#order'); 


// // const formContacts = new OrderFormContactsView(cloneTemplate(formview), events);
// // const formDelivery = new OrderFormPaymentDeliveryView(cloneTemplate(formview2), events);

// // const ordertestContacts = {
// //     "phone": "+71234567890",
// //     "email": "test@test.ru",
// //     valid: true,
// //     errors: ['']
// // }
// // const ordertestDelivery = {

// //     "address": "Spb Vosstania 1",
// //     valid: true,
// //     errors: ['']

// // }

// // modal.render({content: formContacts.render(ordertestContacts)});





// // // modal.render({content: formContacts.render(ordertestContacts)});
// // // modal.render({content: formDelivery.render(ordertestDelivery)});

// // // modal.render({content: formDelivery.render(ordertestDelivery)});





// // // modal.render({content: formContacts.render(bbb)});


// events.on('cards: changed', () => {
// cardsData.items.forEach((item) => {
// const cardnew = new CardViewBase(cloneTemplate(cardview), events);
//  gallery.append(cardnew.render(item));
//  });
//  })

