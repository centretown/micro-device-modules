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
            ip: '192.168.1.200',
            model: 'nano',
            label: '',
            pins: new PinSelectable(),
        },
        {
            ip: '192.168.1.218',
            model: 'esp32',
            label: '',
            pins: new PinSelectable(),
        },
        {
            ip: '192.168.1.217',
            model: 'esp32',
            label: '',
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
            { id: 0, digital: true, label: 'pin 0', purpose: 'reset' },
            { id: 1, digital: true, label: 'pin 1', purpose: 'status' },
            { id: 2, digital: true, label: 'pin 2', purpose: 'led' },
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
