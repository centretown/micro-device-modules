import { SelectableList, ISelectableList } from './selectable-list';

export interface IStoreableList<T> extends ISelectableList<T> {
    load: () => boolean;
    save: () => void;
}

export abstract class StoreableList<T> extends SelectableList<T>
    implements IStoreableList<T> {
    /**
     * subclass must provide a unique key for storage
     */
    abstract LOCAL_STORAGE_KEY: string;

    /**
     * load list from storage
     * @returns true if somethings there otherwise false
     */
    load(): boolean {
        const storage = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (!storage || storage === '') {
            return false;
        }
        this.list = JSON.parse(storage);
        if (this.list.length === 0) {
            return false;
        }
        return true;
    }

    /**
     * sort and save the list to local storage
     */
    save(): void {
        this.sort();
        try {
            localStorage.setItem(
                this.LOCAL_STORAGE_KEY,
                JSON.stringify(this.list),
            );
        } catch (error) {
            // todo: better than this
            throw new Error('problem saving to storage: ' + error);
        }
    }
}
