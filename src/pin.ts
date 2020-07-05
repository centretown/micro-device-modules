import { SelectableList, ISelectableList } from './selectable-list';

export interface Pin {
    id: number;
    label: string;
    purpose: string;
}

export interface IPinSelectable extends ISelectableList<Pin> {}

export class PinSelectable extends SelectableList<Pin>
    implements IPinSelectable {
    key(p: Pin): string {
        return p.id.toString();
    }
}
