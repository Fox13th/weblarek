import { IApi, TGetProductsData, TOrderData, TOrderResponse } from '../types/index.ts';

export class ApiQuery {
    private _api: IApi;

    constructor(_api: IApi) {
        this._api = _api;
    }

    public getProducts(): Promise<TGetProductsData> {
        return this._api.get<TGetProductsData>('/product/');
    }

    public postOrder(orderInfo: TOrderData): Promise<TOrderResponse> {
        return this._api.post<TOrderResponse>('/order/', orderInfo);
    }
}