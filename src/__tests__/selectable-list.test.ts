import { SelectableList } from '../selectable-list';

interface Xi {
    x: number;
    y: number;
    z: number;
    a: string;
    b: boolean;
}

class Xc extends SelectableList<Xi> {
    key(item: Xi): string {
        return item.x.toString();
    }

    newItem(): Xi {
        return {
            x: 0,
            y: 0,
            z: 0,
            a: "",
            b: false
        }
    }
}

test(`
    create a list
    put 3 unique entries into it
    validate the second one
    remove the first entry
    try get the deleted entry and
        verify a null item is returned
    `, () => {
    const p = new Xc();
    p.putList([
        { x: 1, y: 1, z: 1, b: true, a: 'item 1' },
        { x: 3, y: 1, z: 1, b: true, a: 'item 3' },
        { x: 2, y: 1, z: 1, b: true, a: 'item 2' },
    ]);

    expect(p.size()).toBe(3);

    const k1 = p.key(p.item(0));
    const k2 = p.key(p.item(1));

    const x = p.get(k2);
    expect(x).toStrictEqual({ x: 3, y: 1, z: 1, b: true, a: 'item 3' });

    p.remove(k1);
    expect(p.size()).toBe(2);

    expect(p.get(k1)).toStrictEqual(p.newItem());
});

test(`
    create a list and put 3 unique entries into it
    change the 2nd entry and change the a field to 'item 3'
    `, () => {
    const p = new Xc();
    p.putList([
        { x: 2, y: 1, z: 1, b: true, a: 'item 1' },
        { x: 3, y: 1, z: 1, b: true, a: 'item 2' },
        { x: 1, y: 1, z: 1, b: true, a: 'item 2' },
    ]);

    const k3 = p.key(p.item(0));
    const i3 = p.get(k3);
    expect(i3 !== undefined).toBe(true);
    if (i3 !== undefined) {
        i3.a = 'item 3';
        p.put(i3);
    }
    expect(p.size()).toBe(3);

    const j3 = p.get(k3);
    expect(j3 !== undefined).toBe(true);
    if (j3 !== undefined) {
        expect(j3.a).toStrictEqual('item 3');
    }
});

test(`
    create a list and put 3 unique entries into it
    select the 2nd and 3rd entry then 
        verify each selected item
    toggle selection for item 3 then verify not selected
    create a list of selected items then verify list same
      as the selected items
    remove selected and verify
    `, () => {
    const p = new Xc();
    p.putList([
        { x: 2, y: 1, z: 1, b: true, a: 'item 1' },
        { x: 3, y: 1, z: 1, b: true, a: 'item 2' },
        { x: 1, y: 1, z: 1, b: true, a: 'item 3' },
    ]);
    const k1 = p.key(p.item(0));
    const k2 = p.key(p.item(1));
    const k3 = p.key(p.item(2));

    p.toggleSelect(k2);
    p.toggleSelect(k3);
    expect(p.selected()).toBe(2);
    expect(p.isSelected(k2)).toBe(true);
    expect(p.isSelected(k3)).toBe(true);

    p.toggleSelect(k3);
    expect(p.isSelected(k3)).toBe(false);
    p.toggleSelect(k3);
    expect(p.isSelected(k3)).toBe(true);

    const l = p.getSelected();
    expect(l.length).toBe(2);
    expect(l[0]).toStrictEqual(p.get(k2));
    expect(l[1]).toStrictEqual(p.get(k3));

    p.removeSelected();
    expect(p.size()).toBe(1);
    expect(p.selected()).toBe(0);
    expect(p.item(0)).toStrictEqual({ x: 2, y: 1, z: 1, b: true, a: 'item 1' });
});

test(`
    create a list and put 3 entries (2 unique keys) into it
      ensure only 2 entries are added
    `, () => {
    const p = new Xc();
    p.putList([
        { x: 1, y: 1, z: 1, b: true, a: 'item 1' },
        { x: 3, y: 1, z: 1, b: true, a: 'item 3' },
        { x: 3, y: 1, z: 1, b: true, a: 'item 2' },
    ]);
    expect(p.size()).toBe(2);
    const k2 = p.key(p.item(1));
    const i2 = p.get(k2);
    expect(i2 !== undefined).toBe(true);
    if (i2 !== undefined) {
        expect(i2.a).toStrictEqual('item 2');
    }
});

test(`
    create a list and put 4 entries unique items into it
    sort the list and confirm correct order
    `, () => {
    const p = new Xc();
    p.putList([
        { x: 2, y: 2, z: 1, b: true, a: 'item 2' },
        { x: 3, y: 1, z: 1, b: true, a: 'item 3' },
        { x: 1, y: 1, z: 1, b: true, a: 'item 1' },
        { x: 4, y: 1, z: 1, b: true, a: 'item 4' },
    ]);

    const q = p.sort();
    expect(q.length).toBe(4);
    expect(q[0].a).toBe('item 1');
    expect(q[1].a).toBe('item 2');
    expect(q[2].a).toBe('item 3');
    expect(q[3].a).toBe('item 4');
});

test(`
    create a list and put 4 entries unique items into it
    sort the list and confirm correct order
    `, () => {
    const p = new Xc();
    p.putList([
        { x: 1, y: 1, z: 1, b: true, a: 'item 1' },
        { x: 2, y: 2, z: 1, b: true, a: 'item 4' },
        { x: 3, y: 1, z: 1, b: true, a: 'item 3' },
        { x: 4, y: 1, z: 1, b: true, a: 'item 2' },
    ]);

    p.replace([
        { x: 1, y: 1, z: 1, b: true, a: 'replace 1' },
        { x: 2, y: 2, z: 1, b: true, a: 'replace 4' },
        { x: 3, y: 1, z: 1, b: true, a: 'replace 3' },
    ]);

    expect(p.size()).toBe(3);
    expect(p.item(0).a).toBe('replace 1');
    expect(p.item(1).a).toBe('replace 4');
    expect(p.item(2).a).toBe('replace 3');

});
