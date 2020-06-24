import { Pins, pinKey } from '../models/pin'


test('putList 2 pins and ensure  ', () => {
    const p = new Pins()
    p.putList([
        { id: 1, digital: true, label: 'pin 1', purpose: 'booter' },
        { id: 2, digital: true, label: 'pin 2', purpose: 'led' },
    ])
    expect(p.list.length).toBe(2)

    const k = pinKey(p.list[0])
    p.remove(k)
    expect(p.list.length).toBe(1)
});


/*
test('remove 1 pin a see if length is now 1', () => {
});
*/
