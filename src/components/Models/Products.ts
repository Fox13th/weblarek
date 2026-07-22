import { IProduct } from '../../types/index.ts';

export class Products {

    private products: IProduct[];
    private selectedProduct: IProduct | null;

    constructor(products: IProduct[] = []) {
        this.products = [...products];
        this.selectedProduct = null;
    }

    public setItems(products: IProduct[]): void {
        this.products = [...products];
        this.selectedProduct = null;
    }

    public getItems():  IProduct[] {
        return [...this.products];
    }

    public getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    public setSelectedProduct(selectedProduct: IProduct | null): void {
        this.selectedProduct = selectedProduct;
    }

    public getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}