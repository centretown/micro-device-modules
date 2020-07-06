import { ISelectableList, SelectableList } from './selectable-list';

export interface IStoreableList<T> extends ISelectableList<T> {
    load(): boolean;
    save(): void;
}

export abstract class StoreableList<T> extends SelectableList<T>
    implements IStoreableList<T> {
    abstract LOCAL_STORAGE_KEY: string;
    abstract load(): boolean;
    abstract save(): void;
}
