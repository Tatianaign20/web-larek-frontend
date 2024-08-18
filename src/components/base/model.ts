import { IEvents } from './events';


 //Описываем базовый абстрактный класс MODEL, который будет использоваться (наследоаться) в классах сущностей MODAL

export abstract class Model<T> {

    /**Конструктор
     * @param {Partial<T>} data - используемые данные, Partial<T> — это тип, который позволяет создать новый тип со всеми свойствами типа T, но с установленными необязательными свойствами
     * @param {IEvents} events - объект брокера событий
     */
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}
    
    /** 
     * Запускаем событие
	 * Сообщаем об изменении в модели
	 * @param { string } event - идентификатор события, которое отслеживают
	 * @param { object } payload - данные, которые связаны с событием
	 */
	emitChanges(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}
}
