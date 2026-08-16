import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events.ts';

export class Basket {
    private selectedProducts: IProduct[];

    constructor(protected event: IEvents, selectedProducts: IProduct[] = []) {
        this.selectedProducts = [...selectedProducts];
        
    }
    
    public getProducts(): IProduct[] {
        return [...this.selectedProducts];
    }

    public addProduct(product: IProduct): void {
        const exists = this.selectedProducts.some(item => item.id === product.id);

        if (exists) {
            return;
        }

        this.selectedProducts.push(product);
        this.event.emit('basket:changed');
    }

    public removeProduct(product: IProduct): void {
        this.selectedProducts = this.selectedProducts.filter(prod => prod.id !== product.id);
        this.event.emit('basket:changed');
    }

    public clear(): void {
        this.selectedProducts = [];
        this.event.emit('basket:changed');
    }

    public getTotalPrice(): number {
        return this.selectedProducts.reduce((sum, currentValue) => { 
            return sum + (currentValue.price ?? 0);
        }, 0);
    }

    public countProducts(): number {
        return this.selectedProducts.length;
    }

    public getProductById(id: string): boolean {
        return this.selectedProducts.some(product => product.id === id);
    }
}