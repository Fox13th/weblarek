import { IBuyer, ValidError } from '../../types/index.ts';

export class Buyer {

    private buyer: Partial<IBuyer>;
    private errors: ValidError;

    constructor(buyer: IBuyer) {
        this.buyer = {...buyer};
        this.errors = {};
    }

    public setInfo(partialData: Partial<IBuyer>): void {
        this.buyer = {...this.buyer, ...partialData};
    }

    public getInfo(): Partial<IBuyer> {
        return {...this.buyer};
    }

    public clear(): void {
        this.buyer = {};
    }

    public isValid(): ValidError {      
        this.errors = {};

        const requiredFields: (keyof IBuyer)[] = ['payment', 'email', 'phone', 'address'];
        
        for (const key of requiredFields) {
            const value = this.buyer[key];

            if (value === '' || value === null  || value === undefined) {
                this.errors[key as keyof IBuyer] = 'Отсутствует значение';
            }
        }
        return this.errors;
    }
}