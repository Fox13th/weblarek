import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export abstract class Form<T> extends Component<T> {

    protected errorElement: HTMLElement;

    constructor(container: HTMLElement){
        super(container);

        this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    protected checkInput(inputField: HTMLInputElement, field: string) {
        if (inputField.value.trim() === '') {
            return `Необходимо указать ${field}`;
        }
        return '';
    }

    set error(value: string) {
        this.errorElement.textContent = value;
    }

}