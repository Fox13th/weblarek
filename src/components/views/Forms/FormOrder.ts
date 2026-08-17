import { IBuyer, TPayment } from "../../../types";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export type TFormOrder = Pick<IBuyer, 'payment' | 'address'>  & {
    valid: boolean;
    error: string;
};

export class FormOrder extends Form<TFormOrder> {
    protected paymentCardElement: HTMLButtonElement;
    protected paymentCashElement: HTMLButtonElement;
    protected addressElement: HTMLInputElement;
    protected orderButtonElement: HTMLButtonElement;
    protected paymentMethod: TPayment | '' = '';


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

            this.event.emit('form:change', {
                payment: this.paymentMethod
            });
        });

        this.paymentCashElement.addEventListener('click', () => {
            this.paymentMethod = 'cash';
            this.paymentCashElement.classList.add('button_alt-active');
            this.paymentCardElement.classList.remove('button_alt-active');

            this.event.emit('form:change', {
                payment: this.paymentMethod
            });
        });

        this.addressElement.addEventListener('input', () => {
            this.event.emit('form:change', {
                address: this.addressElement.value
            });
        });

        this.submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.event.emit('form:next');
        });

    }

    set payment(value: TPayment) {
        this.paymentMethod = value;
    }

    set address(value: string) {
        this.addressElement.value = value;
    }

}