import { IBuyer } from "../../../types";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export type TFormContact = Pick<IBuyer, 'email' | 'phone'>  & {
    error: number;
};

function checkAddress(inputField: HTMLInputElement, field: string) {
    if (inputField.value.trim() === '') {
        return `Необходимо указать ${field}`;
    }
    return '';
}

function checkForm(inputFieldEmail: HTMLInputElement, inputFieldPhone: HTMLInputElement, field: string): boolean {
    return checkAddress(inputFieldEmail, field) !== '' && checkAddress(inputFieldPhone, field) !== '';
}


export class FormContact extends Form<TFormContact> {
    protected emailElement: HTMLInputElement;
    protected phoneElement: HTMLInputElement;
    protected buyButtonElement: HTMLButtonElement;
    protected paymentMethod: string = '';


    constructor(protected event: IEvents, container: HTMLElement) {
        super(container);

        this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.buyButtonElement = ensureElement<HTMLButtonElement>('.button', this.container);

        this.emailElement.addEventListener('input', () => {
            this.error = checkAddress(this.emailElement, 'Email');
            
            this.buyButtonElement.disabled = checkForm(this.emailElement, this.phoneElement, 'Email');
        });

        this.phoneElement.addEventListener('input', () => {
            this.error = checkAddress(this.phoneElement, 'Телефон');
            this.buyButtonElement.disabled = checkForm(this.phoneElement, this.emailElement, 'Телефон');
        });

        this.buyButtonElement.addEventListener('click', () => {
            this.event.emit('form:buy');
        })

    }

}