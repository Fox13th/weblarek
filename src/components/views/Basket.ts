import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasket {
    list: HTMLElement;
    price: number;
}


export class Basket extends Component<IBasket> {
    protected basketList: HTMLElement;
    protected basketPrice: HTMLElement;
    protected formButton: HTMLButtonElement;
    
    constructor(protected event: IEvents, container: HTMLElement) {
        super(container);

        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
        this.formButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.formButton.addEventListener('click', () => {
            this.event.emit('basket:form');
        });
    }

    set items(itemList: HTMLElement[]) {
        this.basketList.replaceChildren(...itemList);
        this.formButton.disabled = itemList.length === 0;
    }

    set price(value: number) {
        this.basketPrice.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }
}