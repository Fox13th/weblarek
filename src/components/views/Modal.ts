import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected contentElement: HTMLElement;
    protected closeElement: HTMLButtonElement;

    constructor(protected event: IEvents, container: HTMLElement) {
        super(container);

        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeElement.addEventListener('click', () => {
            this.event.emit('modal:close');
        });

        this.container.addEventListener('click',  (event) => {
            if (event.target == event.currentTarget) {
                this.event.emit('modal:close');
            }
        });
    }

    set content(modalWnd: HTMLElement) {
        this.contentElement.replaceChildren(modalWnd);
    }

    
    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
    }
}