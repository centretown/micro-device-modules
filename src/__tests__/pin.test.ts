import { PinSelectable, pinKey } from '../pin';

test(`add 3 pins to the list`, () => {
    const p = new PinSelectable();
    p.putList([
        { id: 0, digital: true, label: 'pin 0', purpose: 'reset' },
        { id: 1, digital: true, label: 'pin 1', purpose: 'status' },
        { id: 2, digital: true, label: 'pin 2', purpose: 'led' },
    ]);
    expect(p.list.length).toBe(3);
    const k = pinKey(p.list[0]);
    p.remove(k);
    expect(p.list.length).toBe(2);
});
