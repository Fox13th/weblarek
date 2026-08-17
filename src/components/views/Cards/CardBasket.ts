import { IProduct } from "../../../types";
import { Card } from "./Card"
import { ensureElement } from "../../../utils/utils";

export interface ICardBasketActions {
    onDelete?: (event: MouseEvent) => void;
}

export type TCardBasket = Pick<IProduct, 'id' | 'title' | 'price'>  & {
    index: number;
};

export class CardBasket extends Card<TCardBasket> {
    protected numberElem: HTMLElement;
    protected cardDeleteButtom: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ICardBasketActions) {
        super(container);

        this.numberElem = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.cardDeleteButtom = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onDelete) {
            this.cardDeleteButtom.addEventListener('click', actions.onDelete);
        }
    }

    set index(value: number) {
        this.numberElem.textContent = String(value);
    }

}