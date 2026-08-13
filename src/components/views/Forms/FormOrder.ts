import { IBuyer } from "../../../types";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export type TFormOrder = Pick<IBuyer, 'payment' | 'address'>  & {
    error: number;
};

function checkAddress(address: HTMLInputElement) {
    if (address.value.trim() === '') {
        return 'Необходимо указать адрес';
    }
    return '';
}

function checkForm(address: HTMLInputElement, payment: string): boolean {
    return checkAddress(address) !== '' || payment === '';
}


export class FormOrder extends Form<TFormOrder> {
    protected paymentCardElement: HTMLButtonElement;
    protected paymentCashElement: HTMLButtonElement;
    protected addressElement: HTMLInputElement;
    protected orderButtonElement: HTMLButtonElement;
    protected paymentMethod: string = '';


    constructor(protected event: IEvents, container: HTMLElement) {
        super(container);

        this.paymentCardElement = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.paymentCashElement = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.orderButtonElement = ensureElement<HTMLButtonElement>('.order__button', this.container);

        this.paymentCardElement.addEventListener('click', () => {
            this.paymentMethod = 'card';
            this.paymentCardElement.classList.add('button_alt-active');
            this.paymentCashElement.classList.remove('button_alt-active');
            this.error = checkAddress(this.addressElement);
            this.orderButtonElement.disabled = checkForm(this.addressElement, this.paymentMethod);
        });

        this.paymentCashElement.addEventListener('click', () => {
            this.paymentMethod = 'cash';
            this.paymentCashElement.classList.add('button_alt-active');
            this.paymentCardElement.classList.remove('button_alt-active');
            this.error = checkAddress(this.addressElement);
            this.orderButtonElement.disabled = checkForm(this.addressElement, this.paymentMethod);
        });

        this.addressElement.addEventListener('input', () => {
            this.error = checkAddress(this.addressElement);
            this.orderButtonElement.disabled = checkForm(this.addressElement, this.paymentMethod);
        });

        this.orderButtonElement.addEventListener('click', () => {
            this.event.emit('form:next');
        })

    }

}