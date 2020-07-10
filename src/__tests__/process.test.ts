import { ProcessStoreable } from '../process';
import { ActionSelectable, Action } from '../action';
import {
    pinMode,
    pinAction,
    DIGITAL_HIGH,
    delayAction,
    DIGITAL_LOW,
} from '../command';

test(`create a list of 3 processes
      get the first process
      add an action to setup
      add 4 actions to loop
      save the list to storage
      load the list from storage
      verify list matches original
      `, () => {
    // create a device list {p} with 3 items
    const p = new ProcessStoreable();
    p.putList([
        {
            label: 'Process 1',
            deviceKey: 'esp32-200',
            purpose: 'Blink',
            setup: new ActionSelectable(),
            loop: new ActionSelectable(),
        },
        {
            label: 'Process 2',
            deviceKey: 'esp32-210',
            purpose: 'Blink',
            setup: new ActionSelectable(),
            loop: new ActionSelectable(),
        },
        {
            label: 'Process 3',
            deviceKey: 'esp32-220',
            purpose: 'Blink',
            setup: new ActionSelectable(),
            loop: new ActionSelectable(),
        },
    ]);

    let seq = 0;

    // set the mode
    const modeAction: Action = pinMode(seq++, {
        id: 2,
        signal: 'digital',
        mode: 'output',
    });
    seq = 0;
    const hiAction: Action = pinAction(seq++, {
        id: 2,
        signal: 'digital',
        mode: 'output',
        value: DIGITAL_HIGH,
    });
    const hiDelay: Action = delayAction(seq++, { duration: 500 });
    const loAction: Action = pinAction(seq++, {
        id: 2,
        signal: 'digital',
        mode: 'output',
        value: DIGITAL_LOW,
    });
    const loDelay: Action = delayAction(seq++, { duration: 500 });

    const k1 = p.key(p.item(0));
    let d1 = p.get(k1);
    expect(d1 !== undefined).toBe(true);
    if (d1 !== undefined) {
        expect(!d1.setup).toBe(false);
        d1.setup.put(modeAction);
        expect(d1.setup.size()).toBe(1);
        expect(d1.setup.get('0')).toStrictEqual(modeAction);

        seq = 0;
        expect(!d1.loop).toBe(false);
        seq = 0;
        d1.loop.putList([hiAction, hiDelay, loAction, loDelay]);
        expect(d1.loop.size()).toBe(4);
        expect(d1.loop.get('0')).toStrictEqual(hiAction);
        expect(d1.loop.get('1')).toStrictEqual(hiDelay);
        expect(d1.loop.get('2')).toStrictEqual(loAction);
        expect(d1.loop.get('3')).toStrictEqual(loDelay);
    }

    // save the process list to storage
    p.save();

    // create an empty process list and load from storage
    const q = new ProcessStoreable();
    expect(q.load()).toBe(true);

    // verify list has 3 items
    expect(q.size()).toBe(3);

    // verify process has 1 setup action and 4 loop actions
    d1 = q.get(k1);
    expect(d1.setup.size()).toBe(1);
    expect(d1.setup.get('0')).toStrictEqual(modeAction);

    expect(d1.loop.size()).toBe(4);
    expect(d1.loop.get('0')).toStrictEqual(hiAction);
    expect(d1.loop.get('1')).toStrictEqual(hiDelay);
    expect(d1.loop.get('2')).toStrictEqual(loAction);
    expect(d1.loop.get('3')).toStrictEqual(loDelay);

    const item = q.newItem();
    expect(item.purpose).toStrictEqual('');
    expect(item.label).toStrictEqual('');
    expect(item.deviceKey).toStrictEqual('');
    expect(item.loop === undefined).toBe(false);
    expect(item.setup === undefined).toBe(false);
});
