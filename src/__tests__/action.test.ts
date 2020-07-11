import {
    ActionSelectable,
    pinAction,
    delayAction,
    modeAction,
} from '../action';

import {
    DIGITAL_HIGH,
    DIGITAL_LOW,
    DIGITAL_SIGNAL,
    OUTPUT_MODE,
} from '../command';

test(`create 2 action lists "setup" and "loop"
        verify size and each entry
        create 3 invalid pin actions and verify empty command
        create 2 invalid mode actions and verify empty command`, () => {
    // setup
    const setup = new ActionSelectable();
    let seq = 0;
    expect(!setup).toBe(false);
    const modeOutput = modeAction(seq++, 2, DIGITAL_SIGNAL, OUTPUT_MODE);
    setup.put(modeOutput);
    expect(setup.size()).toBe(1);
    expect(setup.get('0')).toStrictEqual(modeOutput);

    // loop
    const loop = new ActionSelectable();
    expect(!loop).toBe(false);
    seq = 0;
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

    loop.putList([hiAction, hiDelay, loAction, loDelay]);
    expect(loop.size()).toBe(4);
    expect(loop.get('0')).toStrictEqual(hiAction);
    expect(loop.get('1')).toStrictEqual(hiDelay);
    expect(loop.get('2')).toStrictEqual(loAction);
    expect(loop.get('3')).toStrictEqual(loDelay);

    const item = loop.newItem();
    expect(item.sequence).toStrictEqual(0);
    expect(item.type).toStrictEqual('');
    expect(item.command).toStrictEqual({});

    let badPin = pinAction(seq++, 2, 'X', OUTPUT_MODE, DIGITAL_HIGH);
    expect(badPin.command).toStrictEqual({});
    badPin = pinAction(seq++, 2, DIGITAL_SIGNAL, 'x', DIGITAL_HIGH);
    expect(badPin.command).toStrictEqual({});
    badPin = pinAction(seq++, 2, DIGITAL_SIGNAL, OUTPUT_MODE, DIGITAL_HIGH + 1);
    expect(badPin.command).toStrictEqual({});

    let badMode = modeAction(seq++, 2, 'X', OUTPUT_MODE);
    expect(badMode.command).toStrictEqual({});
    badMode = modeAction(seq++, 2, DIGITAL_SIGNAL, 'x');
    expect(badMode.command).toStrictEqual({});
});
