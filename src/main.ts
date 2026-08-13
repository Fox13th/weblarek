import './scss/styles.scss';

import { Products } from './components/Models/Products.ts';
//import { Basket } from './components/Models/Basket.ts';
import { Buyer } from './components/Models/Buyer.ts'; 
import { Api } from './components/base/Api.ts';
import { EventEmitter } from './components/base/Events.ts';
import { ApiQuery } from './components/ApiQuery.ts';

import { IBuyer, IProduct, TOrderData } from './types/index.ts';
import { API_URL, CDN_URL } from './utils/constants.ts';
import { Header } from './components/views/Header.ts';
import { Modal } from './components/views/Modal.ts';
import { ensureElement } from "./utils/utils";
import { Gallery } from './components/views/Gallery.ts';
import { CardCatalog } from './components/views/Cards/CardСatalog.ts';
import { CardPreview } from './components/views/Cards/CardPreview.ts';
import { Basket } from './components/views/Cards/Basket.ts';
import { CardBasket } from './components/views/Cards/CardBasket.ts';
import { FormOrder } from './components/views/Forms/FormOrder.ts';

// Модели
const products = new Products();
//const basket = new Basket();
const api = new Api(API_URL);


// Шаблоны
const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
const templateCard = ensureElement<HTMLTemplateElement>('#card-catalog');
const templateCardSelect = ensureElement<HTMLTemplateElement>('#card-preview');
const templateCardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const templateOrders = ensureElement<HTMLTemplateElement>('#order');
const templateContacts = ensureElement<HTMLTemplateElement>('#contacts');


const basket = templateBasket.content.firstElementChild?.cloneNode(true) as HTMLElement;
const cardSelect = templateCardSelect.content.firstElementChild?.cloneNode(true) as HTMLElement;
const cardBasketElem = templateCardBasket.content.firstElementChild?.cloneNode(true) as HTMLElement;
const orderAddress = templateOrders.content.firstElementChild?.cloneNode(true) as HTMLElement;
const orderContact = templateOrders.content.firstElementChild?.cloneNode(true) as HTMLElement;

// Контейнеры
const headerContainer = ensureElement<HTMLElement>('.header__container');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

const events = new EventEmitter();

const modal = new Modal(events, modalContainer);
const header = new Header(events, headerContainer);

let selectedItem: IProduct;

const cardPreviewElement = templateCardSelect.content
    .firstElementChild!
    .cloneNode(true) as HTMLElement;


const cardPreview = new CardPreview(events, cardPreviewElement);

const order = new FormOrder(events, orderAddress);
const contacts = new FormOrder(events, orderContact);

const basketWnd = new Basket(events, basket);
const cardElem = new CardBasket(events, cardBasketElem);

// GET-запрос и отображение карточек =======================================================
const apiClient = new ApiQuery(api);

apiClient.getProducts()
    .then(data => {
        products.setItems(data.items);
        products.getItems().forEach(product => {

            const cardElement = templateCard.content.firstElementChild?.cloneNode(true) as HTMLElement;
            
            const card = new CardCatalog(cardElement, {
                onClick: () => events.emit('card:select', product),
            });

            galleryContainer.append(
                card.render({
                    category: product.category,
                    title: product.title,
                    image: CDN_URL + product.image,
                    price: product.price
                })
            );
        })
    })
    .catch(error => console.log(`Ошибка при выполнении GET-запроса: ${error}`));

//===========================================================================================

events.on('modal:close', () => {
    modal.close();
});

events.on('card:select', (product: IProduct) => {

    selectedItem = product;

    cardPreview.render({
        category: product.category,
        title: product.title,
        image: CDN_URL + product.image,
        price: product.price,
        description: product.description
    });

    modal.render({
        content: cardPreview.render()
    });

    modal.open();
})


events.on('basket:open', () => {

    basketWnd.items = basketItems;

    basketWnd.render({
        price: totalPrice
    });

    modal.render({
        content: basketWnd.render()
    });

    modal.open();
});


const basketItems: HTMLElement[] = [];
let countItems: number = 0;
let totalPrice: number = 0;

events.on('card:buy', () => {
    const cardElement = templateCardBasket.content
    .firstElementChild!
    .cloneNode(true) as HTMLElement;

    const card = new CardBasket(events, cardElement);

    countItems = countItems + 1;
    header.render({
        counter: countItems
    })

    card.render({
        index: basketItems.length + 1,
        title: selectedItem.title,
        price: selectedItem.price
    });

    basketItems.push(card.render());
    totalPrice = totalPrice + (selectedItem.price ?? 0);

    basketWnd.items = basketItems;

    modal.close();
});

events.on('basket:delete', (product: { element: HTMLElement , price: number}) => {

    const index = basketItems.indexOf(product.element);
    basketItems.splice(index, 1);
    
    basketItems.forEach((item, index) => {
        const numberElement = ensureElement<HTMLElement>(
            '.basket__item-index',
            item
        );

        numberElement.textContent = String(index + 1);
    })
    
    basketWnd.items = basketItems;

    totalPrice = totalPrice - (product.price ?? 0);

    modal.render({
        content: basketWnd.render({
            price: totalPrice
        })
    });

    countItems = countItems - 1;
    header.render({
        counter: countItems
    });

});

events.on('basket:form', () => {
    modal.render({
        content: order.render()
    });
});

events.on('form:buy', () => {
    modal.render({
        content: contacts.render()
    });
});