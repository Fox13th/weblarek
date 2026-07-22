import { IProduct } from '../../types/index.ts';

export class Basket {
    private selectedProducts: IProduct[];

    constructor(selectedProducts: IProduct[] = []) {
        this.selectedProducts = [...selectedProducts];
    }
    
    public getProducts(): IProduct[] {
        return [...this.selectedProducts];
    }

    public addProduct(product: IProduct): void {
        this.selectedProducts.push(product);
    }

    public removeProduct(product: IProduct): void {
        this.selectedProducts = this.selectedProducts.filter(prod => prod.id !== product.id);
    }

    public clear(): void {
        this.selectedProducts = [];
    }

    public getTotalPrice(): number {
        return this.selectedProducts.reduce((sum, currentValue) => { 
            if (currentValue.price !== null) {
                return sum + currentValue.price;
            }
            return sum;
        }, 0);
    }

    public countProducts(): number {
        return this.selectedProducts.length;
    }

    public getProductById(id: string): boolean {
        return this.selectedProducts.some(product => product.id === id);
    }
}