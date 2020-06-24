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
    return item.x.toString() + item.y.toString() + item.z.toString();
  }
}

test(`
    create a list and put 3 unique entries into it
    ensure the second one is
    remove the first entry
    `, () => {
  const p = new Xc();
  p.putList([
    { x: 1, y: 1, z: 1, b: true, a: 'pin 1' },
    { x: 3, y: 1, z: 1, b: true, a: 'pin 3' },
    { x: 2, y: 1, z: 1, b: true, a: 'pin 2' },
  ]);
  expect(p.list.length).toBe(3);

  const k1 = p.key(p.list[0]);
  const k2 = p.key(p.list[1]);

  const x = p.get(k2);
  expect(x).toStrictEqual({ x: 3, y: 1, z: 1, b: true, a: 'pin 3' });

  p.remove(k1);
  expect(p.list.length).toBe(2);
  expect(p.get(k1)).toBe(undefined);
});

test(`
    create a list and put 3 unique entries into it
    change the 2nd entry and change the a field to 'pin 3'
    `, () => {
  const p = new Xc();
  p.putList([
    { x: 2, y: 1, z: 1, b: true, a: 'pin 1' },
    { x: 3, y: 1, z: 1, b: true, a: 'pin 2' },
    { x: 1, y: 1, z: 1, b: true, a: 'pin 2' },
  ]);
  const k3 = p.key(p.list[0]);
  const i3 = p.get(k3);
  expect(i3 !== undefined).toBe(true);
  if (i3 !== undefined) {
    i3.a = 'pin 3';
    p.put(i3);
  }
  expect(p.list.length).toBe(3);

  const j3 = p.get(k3);
  expect(j3 !== undefined).toBe(true);
  if (j3 !== undefined) {
    expect(j3.a).toStrictEqual('pin 3');
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
    { x: 2, y: 1, z: 1, b: true, a: 'pin 1' },
    { x: 3, y: 1, z: 1, b: true, a: 'pin 2' },
    { x: 1, y: 1, z: 1, b: true, a: 'pin 3' },
  ]);
  const k1 = p.key(p.list[0]);
  const k2 = p.key(p.list[1]);
  const k3 = p.key(p.list[2]);

  p.toggleSelect(k2);
  p.toggleSelect(k3);
  expect(p.selected.size).toBe(2);
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
  expect(p.list.length).toBe(1);
  expect(p.selected.size).toBe(0);
  expect(p.list[0]).toStrictEqual({ x: 2, y: 1, z: 1, b: true, a: 'pin 1' });
});

test(`
    create a list and put 3 entries (2 unique keys) into it
      ensure only 2 entries are added
    `, () => {
  const p = new Xc();
  p.putList([
    { x: 1, y: 1, z: 1, b: true, a: 'pin 1' },
    { x: 3, y: 1, z: 1, b: true, a: 'pin 3' },
    { x: 3, y: 1, z: 1, b: true, a: 'pin 2' },
  ]);
  expect(p.list.length).toBe(2);
  const k2 = p.key(p.list[1]);
  const i2 = p.get(k2);
  expect(i2 !== undefined).toBe(true);
  if (i2 !== undefined) {
    expect(i2.a).toStrictEqual('pin 2');
  }
});

test(`
    create a list and put 4 entries unique items into it
    sort the list and confirm correct order
    `, () => {
  const p = new Xc();
  p.putList([
    { x: 1, y: 1, z: 1, b: true, a: 'pin 1' },
    { x: 3, y: 2, z: 1, b: true, a: 'pin 4' },
    { x: 3, y: 1, z: 1, b: true, a: 'pin 3' },
    { x: 2, y: 1, z: 1, b: true, a: 'pin 2' },
  ]);

  p.sort();
  expect(p.list.length).toBe(4);
  expect(p.list[0].a).toBe('pin 1');
  expect(p.list[1].a).toBe('pin 2');
  expect(p.list[2].a).toBe('pin 3');
  expect(p.list[3].a).toBe('pin 4');
});
