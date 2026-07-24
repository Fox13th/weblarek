import { IBuyer, ValidError } from '../../types/index.ts';

export class Buyer {

    private buyer: Partial<IBuyer>;

    constructor(buyer: IBuyer) {
        this.buyer = {...buyer};
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
        let errors: ValidError = {};

        const requiredFields: (keyof IBuyer)[] = ['payment', 'email', 'phone', 'address'];
        
        for (const key of requiredFields) {
            const value = this.buyer[key];

            if (value === '' || value === null  || value === undefined) {
                errors[key as keyof IBuyer] = `Отсутствует значение у поля ${key}`;
            }
        }
        return errors;
    }
}