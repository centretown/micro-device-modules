import { ISelectableList } from './selectable-list';

export interface IStoreableList<T> extends ISelectableList<T> {
    load: () => boolean;
    save: () => void;
}
