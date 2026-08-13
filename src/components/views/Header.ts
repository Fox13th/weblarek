import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";


interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected counterElement: HTMLElement;
    protected basketElement: HTMLButtonElement;

    constructor(protected event: IEvents, container: HTMLElement) {
        super(container);

        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketElement = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        this.basketElement.addEventListener('click', () => {
            this.event.emit('basket:open');
        })
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }

}