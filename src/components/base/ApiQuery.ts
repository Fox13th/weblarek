import { IApi, TGetData, TOrderData } from '../../types/index.ts';

export class ApiQuery {
    private _api: IApi;

    constructor(_api: IApi) {
        this._api = _api;
    }

    public get(): Promise<TGetData> {
        return this._api.get<TGetData>('/product/');
    }

    public post(orderInfo: TOrderData): Promise<TOrderData> {
        return this._api.post<TOrderData>('/order/', orderInfo);
    }
}