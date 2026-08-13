import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";


export abstract class Card<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected priceValue: number | null = null;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>(
            '.card__title',
            this.container
        );

        this.priceElement = ensureElement<HTMLElement>(
            '.card__price',
            this.container
        );

        const priceText = this.priceElement.textContent?.trim();
        if (priceText) {
            const price = parseInt(priceText);
            this.priceValue = Number.isNaN(price) ? null : price;
        }
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceValue = value;
        this.priceElement.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }

    get price(): number | null {
        return this.priceValue;
    }
}