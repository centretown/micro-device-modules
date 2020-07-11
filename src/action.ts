import { SelectableList, ISelectableList } from './selectable-list';
import {
    PinCommand,
    ModeCommand,
    DelayCommand,
    MODE_COMMAND,
    DELAY_COMMAND,
    PIN_COMMAND,
    delayCommand,
    modeCommand,
    pinCommand,
} from './command';

export interface Action {
    sequence: number;
    type: '' | 'PIN' | 'MODE' | 'DELAY';
    command: {} | PinCommand | ModeCommand | DelayCommand;
}

export interface IActionSelectable extends ISelectableList<Action> {}

export class ActionSelectable extends SelectableList<Action>
    implements IActionSelectable {
    key(a: Action): string {
        return a.sequence.toString();
    }

    newItem(): Action {
        return {
            sequence: 0,
            type: '',
            command: {},
        };
    }
}

export const delayAction = (sequence: number, duration: number): Action => {
    return {
        sequence,
        type: DELAY_COMMAND,
        command: delayCommand(duration),
    };
};

export const modeAction = (
    sequence: number,
    id: number,
    signal: string,
    mode: string,
): Action => {
    return {
        sequence,
        type: MODE_COMMAND,
        command: modeCommand(id, signal, mode),
    };
};

export const pinAction = (
    sequence: number,
    id: number,
    signal: string,
    mode: string,
    value: number,
): Action => {
    return {
        sequence,
        type: PIN_COMMAND,
        command: pinCommand(id, signal, mode, value),
    };
};
