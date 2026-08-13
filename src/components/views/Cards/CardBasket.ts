import { IProduct } from "../../../types";
import { Card } from "./Card"
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";


export type TCardBasket = Pick<IProduct, 'title' | 'price'>  & {
    index: number;
};

export class CardBasket extends Card<TCardBasket> {
    protected numberElem: HTMLElement;
    protected cardDeleteButtom: HTMLButtonElement;
    protected indexElem: number = 0;

    constructor(protected event: IEvents, container: HTMLElement) {
        super(container);

        this.numberElem = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.cardDeleteButtom = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.cardDeleteButtom.addEventListener('click', () => {
            this.event.emit('basket:delete', {element: this.container, price: this.price});
        })
    }

    set index(value: number) {
        this.indexElem = value;
        this.numberElem.textContent = String(value);
    }

    get index() {
        return this.indexElem;
    }
}