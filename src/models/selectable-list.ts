export abstract class SelectableList<T> {
  public list: T[];
  protected selected: Set<string>;

  constructor () {
    this.list = []
    this.selected = new Set<string>()
  }

  /**
   * subclass must provide a unique key for each item
   * @param item
   */
  abstract key(item: T): string;

  /**
   * subclass must provide a unique key for storage
   */
  abstract LOCAL_STORAGE_KEY: string;

  /**
   * put an item in the list, remove it its already there
   * and refresh with the new one
   * @param item
   */
  put (item: T): void {
    const k = this.key(item)
    // only remove if it's there
    this.remove(k)
    this.list = [...this.list, item]
  }

  /**
   * puts a list of items
   * @param list of items to put
   */
  putList (list: T[]): void {
    list.forEach(item => this.put(item))
  }

  /**
   * removes an item from the list
   * caution: but not from the selected set
   * @param k the key of the item
   */
  remove (key: string): void {
    const list = this.list.filter((t) => this.key(t) !== key)
    this.list = list
  }

  /**
   * @returns a list sorted by key
   */
  sort (): T[] {
    return this.list.sort((a: T, b: T) => {
      const ka = this.key(a)
      const kb = this.key(b)
      return ka < kb ? -1 : ka > kb ? 1 : 0
    })
  }

  /**
   * find an item
   * @param k the key string
   * @returns the item or undefined
   */
  find (key: string): T | undefined {
    const item = this.list.find((t) => this.key(t) === key)
    return item
  }

  /**
   * load list from storage
   * @returns true if somethings there otherwise false
   */
  load (): boolean {
    const storage = localStorage.getItem(this.LOCAL_STORAGE_KEY)
    if (!storage || storage === '') {
      return false
    }
    this.list = JSON.parse(storage)
    if (this.list.length === 0) {
      return false
    }
    return true
  }

  /**
   * save the list to local storage
   */
  save (): void {
    try {
      localStorage.setItem(
        this.LOCAL_STORAGE_KEY, JSON.stringify(this.list)
      )
    } catch (error) {
      ;
    }
  }

  /**
   * toggles whether an item is selected
   * @param item - the item to select or deselect
   * @returns true if now selected or false if not
   */
  toggleSelect (key: string): boolean {
    if (this.selected.delete(key)) {
      return false
    }
    this.selected.add(key)
    return true
  }

  /**
   * removes all selected items from the list
   * and clears selected set
   */
  removeSelected (): void {
    this.selected.forEach((item) => {
      this.remove(item)
    })
    this.selected.clear()
  }

  /**
   * @returns the selected items
   */
  getSelected (): T[] {
    let selected: T[] = []
    this.selected.forEach((item) => {
      const found: T | undefined = this.find(item)
      if (found) {
        selected = [...selected, found]
      }
    })
    return selected
  }
};
