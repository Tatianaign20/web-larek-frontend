import { IEvents } from './events';


 //Описываем базовый абстрактный класс MODEL, который будет использоваться (наследоаться) в классах сущностей MODAL
 // В классе использован код учебного проекта Оно

/**
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 */
export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object) {
        // Состав данных можно модифицировать
        this.events.emit(event, payload ?? {});
    }

    // далее можно добавить общие методы для моделей
}