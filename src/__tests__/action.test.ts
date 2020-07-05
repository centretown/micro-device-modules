import {
    ActionSelectable,
    Action,
} from '../action';

import {
    delayAction,
    pinAction,
    pinMode,
    DIGITAL_HIGH,
    DIGITAL_LOW,
} from '../command'

test(`create 2 action lists "setup" and "loop"
        verify size and each entry`, () => {
    // setup
    const setup = new ActionSelectable();
    let seq = 0;
    expect(!setup).toBe(false);
    const modeAction: Action = pinMode(seq++, {
        id: 2,
        signal: 'digital',
        mode: 'output',
    });
    setup.put(modeAction);
    expect(setup.size()).toBe(1);
    expect(setup.get("0")).toStrictEqual(modeAction);

    // loop
    const loop = new ActionSelectable();
    expect(!loop).toBe(false);
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

    loop.putList([hiAction, hiDelay, loAction, loDelay]);
    expect(loop.size()).toBe(4);
    expect(loop.get("0")).toStrictEqual(hiAction);
    expect(loop.get("1")).toStrictEqual(hiDelay);
    expect(loop.get("2")).toStrictEqual(loAction);
    expect(loop.get("3")).toStrictEqual(loDelay);
});
