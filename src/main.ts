import './scss/styles.scss';

import { Products } from './components/Models/Products.ts';
import { Basket } from './components/Models/Basket.ts';
import { Buyer } from './components/Models/Buyer.ts'; 
import { Api } from './components/base/Api.ts';
import { ApiQuery } from './components/ApiQuery.ts';

import { apiProducts } from './utils/data';
import { IBuyer, TOrderData } from './types/index.ts';
import { API_URL } from './utils/constants.ts';

const products = new Products();
const basket = new Basket();
const api = new Api(API_URL);

// Каталог
products.setItems(apiProducts.items);
console.log('Массив товаров из каталога: ', products.getItems());


const idProd = products.getProductById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
console.log('Товар по ID: ', idProd);

if (idProd) {
    products.setSelectedProduct(idProd);
}
console.log('Выбранный товар из каталога: ', products.getSelectedProduct());


// Корзина
for (const item of apiProducts.items) {
    basket.addProduct(item);
}
console.log('Массив товаров в корзине: ', basket.getProducts());

basket.removeProduct(apiProducts.items[1]);
console.log('Массив товаров в корзине после удаления второго элемента: ', basket.getProducts());

console.log('Стоимость всех товаров в корзине: ', basket.getTotalPrice());

console.log('Наличие товара в корзине по ID: ', basket.getProductById('b06cde61-912f-4663-9751-09956c0eed67'));

basket.clear();
console.log('Количество товаров в корзине после очистки: ', basket.countProducts()); 

// Покупатель

const buyerData: IBuyer = {
    payment: 'card',
    email: 'andrew@yandex.ru',
    phone: '+79167777777',
    address: ''
}

const buyer = new Buyer(buyerData);
console.log('Найденные ошибки: ', buyer.isValid());

const new_info = { address: 'Moscow'}
buyer.setInfo(new_info);
console.log('Найденные ошибки: ', buyer.isValid());

console.log('Информация о пользователе: ', buyer.getInfo());

buyer.clear();
console.log('Информация о пользователе после очистки: ', buyer.getInfo());

// Тесты на взаимодействие с сервером
// GET-запрос
const apiClient = new ApiQuery(api);

apiClient.getProducts()
    .then(data => {
        console.log('Ответ на GET-запрос: ', data);
        products.setItems(data.items);
        console.log('Массив товаров из каталога после GET-запроса: ', products.getItems());
    })
    .catch(error => console.log(`Ошибка при выполнении GET-запроса: ${error}`));

const makeOrder: TOrderData = {
    payment: "card", 
    email: "test@test.ru", 
    phone: "+71234567890",    
    address: "Spb Vosstania 1",
    total: 2200,
    items: [
        "854cef69-976d-4c2a-a18c-2aa45046c390",
        "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
    ]
} 

// POST-запрос
apiClient.postOrder(makeOrder)
    .then(response => console.log('Ответ на POST-запрос: ', response))
    .catch(error => console.log(`Ошибка при выполнении POST-запроса: ${error}`));
