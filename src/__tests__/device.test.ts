import { DeviceStoreable } from '../device';
import { PinSelectable } from '../pin';

test(`
    create a device list with 3 items
    add 3 pins to device 1
    save the device list to storage
    create an empty device list and load from storage
    verify list has 3 items
    verify device 1 has 3 pins
    `, () => {
    // create a device list {p} with 3 items
    const p = new DeviceStoreable();
    p.putList([
        {
            label: 'nano-200',
            ip: '192.168.1.200',
            model: 'nano',
            pins: new PinSelectable(),
        },
        {
            label: 'esp32-218',
            ip: '192.168.1.218',
            model: 'esp32',
            pins: new PinSelectable(),
        },
        {
            label: 'esp32-217',
            ip: '192.168.1.217',
            model: 'esp32',
            pins: new PinSelectable(),
        },
    ]);

    // add 3 pins to device 1
    const k1 = p.key(p.item(0));
    let d1 = p.get(k1);
    expect(d1 !== undefined).toBe(true);
    if (d1 !== undefined) {
        const p1 = d1.pins;
        p1.putList([
            { id: 0, label: 'pin 0', purpose: 'reset' },
            { id: 1, label: 'pin 1', purpose: 'status' },
            { id: 2, label: 'pin 2', purpose: 'led' },
        ]);
        expect(p1.size()).toBe(3);
    }

    // save the device list to storage
    p.save();

    // create an empty device list and load from storage
    const q = new DeviceStoreable();
    expect(q.load()).toBe(true);

    // verify list has 3 items
    expect(q.size()).toBe(3);

    // verify device 1 has 3 pins
    d1 = q.get(k1);
    expect(d1.pins.size()).toBe(3);
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
    const p = new DeviceStoreable();
    p.putList([
        {
            label: 'nano-200',
            ip: '192.168.1.200',
            model: 'nano',
            pins: new PinSelectable(),
        },
        {
            label: 'esp32-218',
            ip: '192.168.1.218',
            model: 'esp32',
            pins: new PinSelectable(),
        },
        {
            label: 'esp32-217',
            ip: '192.168.1.217',
            model: 'esp32',
            pins: new PinSelectable(),
        },
    ]);
    const k1 = p.key(p.item(0));
    const k2 = p.key(p.item(1));
    const k3 = p.key(p.item(2));

    expect(p.toggleSelect(k2)).toBe(true);
    expect(p.toggleSelect(k3)).toBe(true);
    expect(p.selected()).toBe(2);
    expect(p.isSelected(k2)).toBe(true);
    expect(p.isSelected(k3)).toBe(true);

    expect(p.toggleSelect(k3)).toBe(false);
    expect(p.isSelected(k3)).toBe(false);
    expect(p.toggleSelect(k3)).toBe(true);
    expect(p.isSelected(k3)).toBe(true);

    const l = p.getSelected();
    expect(l.length).toBe(2);
    expect(l[0]).toStrictEqual(p.get(k2));
    expect(l[1]).toStrictEqual(p.get(k3));

    p.removeSelected();
    expect(p.size()).toBe(1);
    expect(p.selected()).toBe(0);
    expect(p.item(0).ip).toStrictEqual('192.168.1.200');
});
