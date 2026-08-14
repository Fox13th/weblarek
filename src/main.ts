import './scss/styles.scss';

import { Products } from './components/Models/Products.ts';
import { Api } from './components/base/Api.ts';
import { EventEmitter } from './components/base/Events.ts';
import { ApiQuery } from './components/ApiQuery.ts';

import { IProduct } from './types/index.ts';
import { API_URL, CDN_URL } from './utils/constants.ts';
import { Header } from './components/views/Header.ts';
import { Modal } from './components/views/Modal.ts';
import { ensureElement } from "./utils/utils";
import { CardCatalog } from './components/views/Cards/CardСatalog.ts';
import { CardPreview } from './components/views/Cards/CardPreview.ts';
import { Basket } from './components/views/Basket.ts';
import { CardBasket } from './components/views/Cards/CardBasket.ts';
import { FormOrder } from './components/views/Forms/FormOrder.ts';
import { FormContact } from './components/views/Forms/FormContacts.ts';
import { ClassSuccess } from './components/views/Success.ts';

const products = new Products();
const api = new Api(API_URL);
const apiClient = new ApiQuery(api);
const events = new EventEmitter();

const headerContainer = ensureElement<HTMLElement>('.header__container');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
const templateCard = ensureElement<HTMLTemplateElement>('#card-catalog');
const templateCardSelect = ensureElement<HTMLTemplateElement>('#card-preview');
const templateCardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const templateOrders = ensureElement<HTMLTemplateElement>('#order');
const templateContacts = ensureElement<HTMLTemplateElement>('#contacts');
const templateSuccess = ensureElement<HTMLTemplateElement>('#success');

const basket = templateBasket.content.firstElementChild?.cloneNode(true) as HTMLElement;
const cardPreviewElement = templateCardSelect.content.firstElementChild!.cloneNode(true) as HTMLElement;
const orderAddress = templateOrders.content.firstElementChild?.cloneNode(true) as HTMLElement;
const orderContact = templateContacts.content.firstElementChild?.cloneNode(true) as HTMLElement;
const orderSuccess = templateSuccess.content.firstElementChild?.cloneNode(true) as HTMLElement;

const header = new Header(events, headerContainer);
const modal = new Modal(events, modalContainer);
const cardPreview = new CardPreview(events, cardPreviewElement);
const basketWnd = new Basket(events, basket);
const order = new FormOrder(events, orderAddress);
const contacts = new FormContact(events, orderContact);
const success = new ClassSuccess(events, orderSuccess);

let selectedItem: IProduct;
const basketItems: HTMLElement[] = [];
let countItems: number = 0;
let totalPrice: number = 0;

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

events.on('form:next', () => {
    modal.render({
        content: contacts.render()
    });
});

events.on('form:success', () => {
    modal.render({
        content: success.render({
            total: totalPrice
        })
    });
});

events.on('success:close', () => {
    basketItems.length = 0;
    basketWnd.items = basketItems;
    basketWnd.render({
        price: 0
    });
    totalPrice = 0;
    countItems = 0;
    header.render({
        counter: countItems
    });
    modal.close();
});
