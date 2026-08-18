import { IBuyer } from "../../../types";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export type TFormContact = Pick<IBuyer, 'email' | 'phone'>  & {
    valid: boolean
    errors: string;
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
            this.event.emit('form:change', {
                email: this.emailElement.value
            });
        });

        this.phoneElement.addEventListener('input', () => {
            this.event.emit('form:change', {
                phone: this.phoneElement.value
            });
        });

        this.submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.event.emit('form:success');
        });
    }

    set email(value: string) {
        this.emailElement.value = value;
    }

    set phone(value: string) {
        this.phoneElement.value = value;
    }
}