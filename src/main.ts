import './scss/styles.scss';

import { Products } from './components/Models/Products.ts';
import { Api } from './components/base/Api.ts';
import { EventEmitter } from './components/base/Events.ts';
import { ApiQuery } from './components/ApiQuery.ts';

import { IProduct, TPayment } from './types/index.ts';
import { API_URL, CDN_URL } from './utils/constants.ts';
import { Header } from './components/views/Header.ts';
import { Modal } from './components/views/Modal.ts';
import { ensureElement } from "./utils/utils";
import { CardCatalog } from './components/views/Cards/CardСatalog.ts';
import { CardPreview } from './components/views/Cards/CardPreview.ts';
import { BasketView } from './components/views/Basket.ts';
import { CardBasket } from './components/views/Cards/CardBasket.ts';
import { FormOrder } from './components/views/Forms/FormOrder.ts';
import { FormContact } from './components/views/Forms/FormContacts.ts';
import { ClassSuccess } from './components/views/Success.ts';
import { Basket } from './components/Models/Basket.ts';
import { Buyer } from './components/Models/Buyer.ts';

const events = new EventEmitter();

const products = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events, {
    payment: '',
    address: '',
    email: '',
    phone: ''
});

const api = new Api(API_URL);
const apiClient = new ApiQuery(api);

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
const basketWnd = new BasketView(events, basket);
const order = new FormOrder(events, orderAddress);
const contacts = new FormContact(events, orderContact);
const success = new ClassSuccess(events, orderSuccess);

apiClient.getProducts()
    .then(data => {
        products.setItems(data.items);
        
    })
    .catch(error => console.log(`Ошибка при выполнении GET-запроса: ${error}`));

events.on('products:changed', () => {
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
});

events.on('modal:close', () => {
    modal.close();
});

events.on('card:select', (product: IProduct) => {
    products.setSelectedProduct(product);
})

events.on('product:selected', () => {
    const product = products.getSelectedProduct();

    if (!product) {
        return;
    }

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
});

events.on('basket:open', () => {
    modal.render({
        content: basketWnd.render()
    });

    modal.open();
});

events.on('card:buy', () => {
    const product = products.getSelectedProduct();

    if (!product) {
        return;
    }

    basketModel.addProduct(product);
    modal.close();
});

events.on('basket:changed', () => {

    const products = basketModel.getProducts();

    const items = products.map((product, index) => {
        const cardElement = templateCardBasket.content
            .firstElementChild!
            .cloneNode(true) as HTMLElement;

        const card = new CardBasket(events, cardElement, product);

        return card.render({
            index: index + 1,
            title: product.title,
            price: product.price
        });
    });

    basketWnd.items = items;

    header.render({
        counter: basketModel.countProducts()
    });

    basketWnd.render({
        price: basketModel.getTotalPrice()
    });
})

events.on('basket:delete', ({ product }: { product: IProduct }) => {
    basketModel.removeProduct(product);
});

events.on('basket:form', () => {
    modal.render({
        content: order.render()
    });
});

events.on('form:next', (data: { payment: TPayment; address: string; }) => {
    buyerModel.setInfo(data);

    modal.render({
        content: contacts.render()
    });
});

events.on('form:success', (data: { email: string; phone: string;}) => {
    buyerModel.setInfo(data);

    modal.render({
        content: success.render({
            total: basketModel.getTotalPrice()
        })
    });
});

events.on('success:close', () => {
    basketModel.clear();
    modal.close();
});
