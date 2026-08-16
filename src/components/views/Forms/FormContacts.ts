import { IBuyer } from "../../../types";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export type TFormContact = Pick<IBuyer, 'email' | 'phone'>  & {
    error: number;
};

export class FormContact extends Form<TFormContact> {
    protected emailElement: HTMLInputElement;
    protected phoneElement: HTMLInputElement;
    protected buyButtonElement: HTMLButtonElement;

    constructor(protected event: IEvents, container: HTMLElement) {
        super(container);

        this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.buyButtonElement = ensureElement<HTMLButtonElement>('.button', this.container);

        this.emailElement.addEventListener('input', () => {
            this.error = this.checkInput(this.emailElement, 'Email');
            
            this.buyButtonElement.disabled = this.checkForm(this.emailElement, this.phoneElement);
        });

        this.phoneElement.addEventListener('input', () => {
            this.error = this.checkInput(this.phoneElement, 'Телефон');
            this.buyButtonElement.disabled = this.checkForm(this.emailElement, this.phoneElement);
        });

        this.buyButtonElement.addEventListener('click', (event) => {
            event.preventDefault();
            this.event.emit('form:success', { email: this.emailElement.value, phone: this.phoneElement.value });
        })
    }

    protected checkForm(inputFieldEmail: HTMLInputElement, inputFieldPhone: HTMLInputElement): boolean {
        return this.checkInput(inputFieldEmail, 'Email') !== '' || this.checkInput(inputFieldPhone, 'Телефон') !== '';
    }

}