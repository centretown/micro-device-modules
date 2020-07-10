import { SelectableList, ISelectableList } from './selectable-list';

export interface Action {
    sequence: number;
    type: string;
    action: any;
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
            action: '',
        };
    }
}
