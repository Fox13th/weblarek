import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card"

type CategoryKey = keyof typeof categoryMap;

export type TCardPreview = Pick<IProduct, 'title' | 'price' | 'image' | 'category' | 'description'> & {
    isExist: boolean;
    isAvailable: boolean;
};

export class CardPreview extends Card<TCardPreview> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected describeElement: HTMLElement;
    protected buyButtonElement: HTMLButtonElement;

    constructor(protected event: IEvents, container: HTMLElement) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.describeElement = ensureElement<HTMLElement>('.card__text', this.container);

        this.buyButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.buyButtonElement.addEventListener('click', () => {
            this.event.emit('card:buy');
        });
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
    
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            );
        }
    }

    set description(value: string) {
        this.describeElement.textContent = value;
    }

    set isExist(value: boolean) {
        this.buyButtonElement.textContent = value ? 'Удалить из корзины' : 'В корзину';
    }

    set isAvailable(value: boolean) {
        this.buyButtonElement.disabled = !value;

        if (!value) {
            this.buyButtonElement.textContent = 'Недоступно';
        }
    }
}