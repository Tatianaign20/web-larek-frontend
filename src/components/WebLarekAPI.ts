import { Api, ApiListResponse } from './base/api';
import { ICard, IOrderAPI } from '../types';

/**
 * Описываем меоды для работы с API
 */
/**
 * Интерфейс IWebLarekAPI для интернет-магазина
 * @method getCardItem - метод получения информации по конкретной карточке
 * @method getCardList - метод получения списка карточек
 * @method postOrderCards - метод отправки на сервер запроса по заказу
 */
interface IWebLarekAPI {
	getCardItem: (id: string) => Promise<ICard>;
	getCardList: () => Promise<ICard[]>;
	postOrderCards: (order: IOrderAPI) => Promise<IOrderResult>;
}
/**
 * Интерфейс IOrderResult - ответ на POST запрос на оформление заказа (postman)
 * @property {string} id - идентификатор заказа
 * @property {number} total - общая сумма заказа
 */
interface IOrderResult {
	id: string;
	total: number;
}
/**
 * Описываем класс для работы с API
 */
/**
 * Класс WebLarekAPI для интернет магазина наследует базовый класс взаимодействия с сервером Api, реализует интерфейс IWebLarekAPI
 */
export class WebLarekAPI extends Api implements IWebLarekAPI {
	private readonly cdn: string;
	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { string } cdn используемый домен со статикой
	 * @param { string } baseUrl используемый домен сервера
	 * @param { RequestInit } options параметры запроса
	 */
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}
	/**
	 * Получение информации по конкретной карточке
	 * @param { string } id идентификатор карточки
	 * @returns { Promise<ICard> } объект карточки
	 */
	getCardItem(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}
	/**
	 * Получаем список карточек с использованием метода map
	 * @returns { Promise<ICard[]> } объекты карточек
	 */
	getCardList(): Promise<ICard[]> {
		return this.get('/product/').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}
	/**
	 * Отправлем на сервер запрос по заказу
	 * @param { IOrderAPI } order данные запроса
	 * @returns { Promise<IOrderResult> } возвращаем результат запроса
	 */
	postOrderCards(order: IOrderAPI): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}