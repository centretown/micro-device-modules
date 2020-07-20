import { ProcessStoreable } from '../process';

import {
    pinAction,
    delayAction,
    modeAction,
    ActionSelectable,
} from '../action';
import {
    DIGITAL_SIGNAL,
    OUTPUT_MODE,
    DIGITAL_HIGH,
    DIGITAL_LOW,
} from '../command';
import { Process } from '../process';

export const inputList: Process[] = [
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
];

export const hiAction = pinAction(
    0,
    2,
    DIGITAL_SIGNAL,
    OUTPUT_MODE,
    DIGITAL_HIGH,
);
export const hiDelay = delayAction(1, 200);
export const loAction = pinAction(
    2,
    3,
    DIGITAL_SIGNAL,
    OUTPUT_MODE,
    DIGITAL_LOW,
);

export const loDelay = delayAction(3, 500);

export const modeOutput = modeAction(0, 2, DIGITAL_SIGNAL, OUTPUT_MODE);

export const jsonData: string = `{"label":"Process 1","deviceKey":"esp32-200","purpose":"Blink","setup":[{"sequence":0,"type":"MODE","command":{"id":2,"signal":"digital","mode":"output"}}],"loop":[{"sequence":0,"type":"PIN","command":{"id":2,"signal":"digital","mode":"output","value":1}},{"sequence":1,"type":"DELAY","command":{"duration":200}},{"sequence":2,"type":"PIN","command":{"id":3,"signal":"digital","mode":"output","value":0}},{"sequence":3,"type":"DELAY","command":{"duration":500}}]}`;

const setupProcess = (): ProcessStoreable => {
    const p = new ProcessStoreable();
    p.putList(inputList);
    p.item(0).setup.putList([modeOutput]);
    p.item(0).loop.putList([hiAction, hiDelay, loAction, loDelay]);
    return p;
};

test(`create a list of 3 processes
      get the first process
      add an action to setup and verify
      add 4 actions to loop and verify
      create a new item and verify contents

      toggle item and select
      save the list to storage
      load the list from storage
      verify list matches original

      toggle 2 items  
      select the 2nd one
      modify item including sub-lists
      save to storage
      load from storage and verify data
      `, () => {
    // create a device list {p} with 3 items
    const p = setupProcess();

    const k1 = p.key(p.item(0));
    let d1 = p.get(k1);

    expect(d1 !== undefined).toBe(true);
    if (d1 !== undefined) {
        expect(!d1.setup).toBe(false);
        expect(d1.setup.size()).toBe(1);
        expect(d1.setup.get('0')).toStrictEqual(modeOutput);

        expect(!d1.loop).toBe(false);
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
    // verify setup actions
    expect(d1.setup.get('0')).toStrictEqual(modeOutput);

    // verify loop size and actions
    expect(d1.loop.size()).toBe(4);
    expect(d1.loop.get('0')).toStrictEqual(hiAction);
    expect(d1.loop.get('1')).toStrictEqual(hiDelay);
    expect(d1.loop.get('2')).toStrictEqual(loAction);
    expect(d1.loop.get('3')).toStrictEqual(loDelay);

    // create new and verify
    const item = q.newItem();
    expect(item.purpose).toStrictEqual('');
    expect(item.label).toStrictEqual('');
    expect(item.deviceKey).toStrictEqual('');
    expect(item.loop === undefined).toBe(false);
    expect(item.setup === undefined).toBe(false);

    p.toggleSelect(p.key(p.item(0)));
    p.toggleSelect(p.key(p.item(1)));
    const psel = p.getSelected();
    expect(psel.length).toBe(2);
    let pitem = psel[1];

    expect(pitem === undefined).toBe(false);

    expect(pitem.label).toBe('Process 2');
    expect(pitem.deviceKey).toBe('esp32-210');
    expect(pitem.purpose).toBe('Blink');

    // modify
    pitem.purpose = 'Blink Blink';
    p.put(pitem);
    // verify
    const pkey = p.key(pitem);
    pitem = p.get(pkey);
    expect(pitem.purpose).toBe('Blink Blink');
    // save
    p.save();

    // load and verify
    q.load();
    pitem = q.get(pkey);
    expect(pitem.purpose).toBe('Blink Blink');
});

test(`
    create a device list {p} with 3 items
        and add 3 actions
    convert to JSON format and compare to expected
    `, () => {
    // create a device list {p} with 3 items
    const p = setupProcess();
    const k1 = p.key(p.item(0));
    const p1 = p.get(k1);
    const pf1 = p.flatten(p1);
    expect(JSON.stringify(pf1)).toStrictEqual(jsonData);
});
