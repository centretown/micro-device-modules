import { Action } from './action';
import { Pin } from './pin';

export const PIN_COMMAND = 'PIN';
export const MODE_COMMAND = 'MODE';
export const DELAY_COMMAND = 'DELAY';

// signal types
export const ANALOG_SIGNAL = 'analog';
export const DIGITAL_SIGNAL = 'digital';

// mode types
export const OUTPUT_MODE = 'output';
export const INPUT_MODE = 'input';

// pin values
export const DIGITAL_HIGH = 1;
export const DIGITAL_LOW = 0;
export const ANALOG_HIGH = 4095;
export const ANALOG_LOW = 0;

export interface DelayCommand {
    duration: number;
}

export interface ModeCommand {
    id: number;
    signal: 'analog' | 'digital';
    mode: 'output' | 'input';
}

export interface PinCommand extends ModeCommand {
    value: number;
}

export const validMode = (mode: string): boolean => {
    return mode === INPUT_MODE || mode === OUTPUT_MODE;
};

export const validSignal = (signal: string): boolean => {
    return signal === ANALOG_SIGNAL || signal === DIGITAL_SIGNAL;
};

export const validValue = (signal: string, value: number): boolean => {
    if (signal === ANALOG_SIGNAL)
        return value >= ANALOG_LOW && value <= ANALOG_HIGH;
    if (signal === DIGITAL_SIGNAL)
        return value >= DIGITAL_LOW && value <= DIGITAL_HIGH;
    return false;
};

export function delayCommand(duration: number): DelayCommand {
    return { duration };
}

export function modeCommand(
    id: number,
    signal: string,
    mode: string,
): ModeCommand {
    if (validMode(mode) && validSignal(signal))
        return { id, signal, mode } as ModeCommand;
    return {} as ModeCommand;
}

export function pinCommand(
    id: number,
    signal: string,
    mode: string,
    value: number,
): PinCommand {
    if (validMode(mode) && validSignal(signal) && validValue(signal, value))
        return { id, signal, mode, value } as PinCommand;
    return {} as PinCommand;
}
