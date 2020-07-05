import { Action } from "./action"
export const PIN_ACTION = 'PIN';
export const DIGITAL_HIGH = 1;
export const DIGITAL_LOW = 0;
export const ANALOG_MIN = 0;
export const ANALOG_MAX = 4095;

export interface PinType {
    id: number;
    signal: 'analog' | 'digital';
    mode: 'output' | 'input';
    value: number;

}

export function pinAction(sequence: number, action: PinType): Action {
    return { sequence, type: PIN_ACTION, action };
}

export const PIN_MODE = 'PIN_MODE';
export interface PinMode {
    id: number;
    signal: 'analog' | 'digital';
    mode: 'output' | 'input';
}

export function pinMode(sequence: number, action: PinMode): Action {
    return { sequence, type: PIN_MODE, action };
}

export const DELAY_ACTION = 'DELAY';

export interface DelayType {
    duration: number;
}

export function delayAction(sequence: number, action: DelayType): Action {
    return { sequence, type: DELAY_ACTION, action };
}
