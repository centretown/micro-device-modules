import { ProcessStoreable } from '../process';
import {
    ActionSelectable,
    Action,
    pinAction,
    delayAction,
    modeAction,
} from '../action';
import {
    DIGITAL_HIGH,
    DIGITAL_LOW,
    PIN_COMMAND,
    pinCommand,
    DELAY_COMMAND,
    delayCommand,
    modeCommand,
    DIGITAL_SIGNAL,
    OUTPUT_MODE,
    MODE_COMMAND,
} from '../command';

test(`create a list of 3 processes
      get the first process
      add an action to setup
      add 4 actions to loop
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
    const hiAction = pinAction(
        seq++,
        2,
        DIGITAL_SIGNAL,
        OUTPUT_MODE,
        DIGITAL_HIGH,
    );
    const hiDelay = delayAction(seq++, 200);
    const loAction = pinAction(
        seq++,
        2,
        DIGITAL_SIGNAL,
        OUTPUT_MODE,
        DIGITAL_LOW,
    );
    const loDelay = delayAction(seq++, 500);

    seq = 0;
    const modeOutput = modeAction(seq++, 2, DIGITAL_SIGNAL, OUTPUT_MODE);

    const k1 = p.key(p.item(0));
    let d1 = p.get(k1);

    expect(d1 !== undefined).toBe(true);
    if (d1 !== undefined) {
        expect(!d1.setup).toBe(false);
        d1.setup.put(modeOutput);
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
    expect(d1.setup.get('0')).toStrictEqual(modeOutput);

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

    p.toggleSelect(p.key(p.item(0)));
    p.toggleSelect(p.key(p.item(1)));
    const psel = p.getSelected();
    expect(psel.length).toBe(2);
    let pitem = psel[1];

    expect(pitem === undefined).toBe(false);

    expect(pitem.label).toBe('Process 2');
    expect(pitem.deviceKey).toBe('esp32-210');
    expect(pitem.purpose).toBe("Blink");
    const pkey = p.key(pitem);

    pitem.purpose = "Blink Blink";

    p.put(pitem);
    pitem = p.get(pkey);
    expect(pitem.purpose).toBe("Blink Blink");
    p.save();

    q.load();
    pitem = q.get(pkey);
    expect(pitem.purpose).toBe("Blink Blink");

});
