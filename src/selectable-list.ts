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
}

export abstract class SelectableList<T> implements ISelectableList<T> {
    public list: T[];
    public selected: Set<string>;

    constructor() {
        this.list = [];
        this.selected = new Set<string>();
    }

    /**
     * subclass must provide a unique key for each item
     * @param item
     */
    abstract key(item: T): string;

    /**
     * put an item in the list, remove it its already there
     * and refresh with the new one
     * @param item
     */
    put(item: T): void {
        const k = this.key(item);
        // only remove if it's there
        this.remove(k);
        this.list = [...this.list, item];
    }

    /**
     * puts a list of items
     * @param list of items to put
     */
    putList(list: T[]): void {
        list.forEach((item) => this.put(item));
    }

    /**
     * removes an item from the list
     * and from the selected set
     * @param k the key of the item
     */
    remove(key: string): void {
        const list = this.list.filter((t) => this.key(t) !== key);
        if (this.isSelected(key)) {
            this.toggleSelect(key);
        }
        this.list = list;
    }

    /**
     * sort the list by key
     */
    sort(): T[] {
        this.list = this.list.sort((a: T, b: T) => {
            const ka = this.key(a);
            const kb = this.key(b);
            return ka < kb ? -1 : ka > kb ? 1 : 0;
        });
        return this.list;
    }

    /**
     * get an item
     * @param k the key string
     * @returns the item or undefined
     */
    get(key: string): T | undefined {
        const item = this.list.find((t) => this.key(t) === key);
        return item;
    }

    /**
     * toggles whether an item is selected
     * @param item - the item to select or deselect
     * @returns true if now selected or false if not
     */
    toggleSelect(key: string): boolean {
        if (this.selected.delete(key)) {
            return false;
        }
        this.selected.add(key);
        return true;
    }

    /**
     * removes all selected items from the list
     * and clears selected set
     */
    removeSelected(): void {
        this.selected.forEach((item) => {
            this.remove(item);
        });
        this.selected.clear();
    }

    /**
     * @returns the selected items
     */
    getSelected(): T[] {
        let selected: T[] = [];
        this.selected.forEach((item) => {
            const found: T | undefined = this.get(item);
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
        return this.selected.has(key);
    }
}
