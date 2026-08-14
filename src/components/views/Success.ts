import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess {
    total: number;
}

export class ClassSuccess extends Component<ISuccess> {
    protected totalPriceElement: HTMLElement;
    protected closeButtonElement: HTMLButtonElement;

    constructor(protected event: IEvents, container: HTMLElement) {
        super(container);

        this.totalPriceElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButtonElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.closeButtonElement.addEventListener('click', () => {
            this.event.emit('success:close');
        });
    }

    set total(value: number) {
        this.totalPriceElement.textContent = `Списано ${value} синапсов`;
    }
}