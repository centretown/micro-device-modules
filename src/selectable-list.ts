export interface ISelectableList<T> {
    key: (item: T) => string;
    put: (item: T) => void;
    putList: (item: T[]) => void;
    remove: (key: string) => void;
    sort: () => T[];
    get: (key: string) => T | undefined;
    toggleSelect: (key: string) => boolean;
    isSelected: (key: string) => boolean;
    removeSelected: () => void;
    getSelected: () => T[];
    selected: () => number;
    size: () => number;
    nullItem: (item: T) => T;
}

export abstract class SelectableList<T> implements ISelectableList<T> {
    private _list: T[];
    private _selected: Set<string>;
    private _nullItem: T;

    constructor() {
        this._list = [];
        this._selected = new Set<string>();
        this._nullItem = {} as T;
    }

    /**
     * subclass must provide a unique key for each item
     * @param item
     */
    abstract key(item: T): string;

    /**
     * subclass must provide a unique key for each item
     * @param item
     */
    abstract newItem(): T;

    /**
     * @returns is equal to empty type
     * @param item
     */
    nullItem(): T {
        return this._nullItem;
    }

    /**
     * @returns list length
     */
    size(): number {
        return this._list.length;
    }

    /**
     * put an item in the list, remove it its already there
     * and refresh with the new one
     * @param item
     */
    put(item: T): void {
        if (item) {
            const key = this.key(item);
            this._list = [
                ...this._list.filter((t) => this.key(t) !== key),
                item,
            ];
        }
    }

    /**
     * puts a list of items
     * @param list of items to put
     */
    putList(list: T[]): void {
        if (!list) {
            return;
        }
        // remove duplicate keys from parameter list
        // keep last one found
        let newList: T[] = [];
        list.forEach((item) => {
            const k = this.key(item);
            newList = [...newList.filter((t) => this.key(t) !== k), item];
        });

        // filter out anything from the new parameter list
        this._list = [
            ...this._list.filter((item) => {
                const k = this.key(item);
                newList.some((t) => this.key(t) === k);
            }),
            ...newList,
        ];
    }

    /**
     * removes an item from the list
     * and from the selected set
     * @param k the key of the item
     */
    remove(key: string): void {
        const list = this._list.filter((t) => this.key(t) !== key);
        if (this.isSelected(key)) {
            this.toggleSelect(key);
        }
        this._list = list;
    }

    /**
     * replace underlying list with replacement
     * @param list replacement list
     */
    replace(list: T[]): void {
        this._list = [...list];
    }

    /**
     * @returns a copy if the internal list ordered by key
     */
    sort(): T[] {
        const r = [...this._list];
        r.sort((a: T, b: T) => {
            const ka = this.key(a);
            const kb = this.key(b);
            return ka < kb ? -1 : ka > kb ? 1 : 0;
        });
        return r;
    }

    /**
     * get an item
     * @param k the key string
     * @returns the item or undefined
     */
    get(key: string): T {
        const item = this._list.find((t) => this.key(t) === key);
        return item ? item : this._nullItem;
    }

    /**
     * toggles whether an item is selected
     * @param item - the item to select or deselect
     * @returns true if now selected or false if not
     */
    toggleSelect(key: string): boolean {
        if (this._selected.delete(key)) {
            return false;
        }
        this._selected.add(key);
        return true;
    }

    /**
     * removes all selected items from the list
     * and clears selected set
     */
    removeSelected(): void {
        this._selected.forEach((item) => {
            this.remove(item);
        });
        this._selected.clear();
    }

    /**
     * @returns the number of items selected
     */
    selected(): number {
        return this._selected.size;
    }

    /**
     * @returns list item at index
     * @param index in the list
     */
    item(index: number): T {
        if (index >= 0 && index < this._list.length) return this._list[index];
        return this._nullItem;
    }

    /**
     * @returns a copy of the internal list
     */
    getAll(): T[] {
        return [...this._list];
    }

    /**
     * @returns the selected items
     */
    getSelected(): T[] {
        let selected: T[] = [];
        this._selected.forEach((item) => {
            const found: T = this.get(item);
            if (found) {
                selected = [...selected, found];
            }
        });
        return selected;
    }

    /**
     * @returns true if key selected
     */
    isSelected(key: string): boolean {
        return this._selected.has(key);
    }
}
