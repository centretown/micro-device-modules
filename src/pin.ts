import { SelectableList, ISelectableList } from './selectable-list';

export interface Pin {
    digital: boolean;
    id: number;
    label: string;
    purpose: string;
}

export interface IPinSelectable extends ISelectableList<Pin> {}

export const pinKey = (p: Pin): string => {
    const sd = p.digital ? 'd' : 'a';
    return sd + '.' + p.id.toString();
};

export const signalText = (signal: boolean): string => {
    return signal ? 'Digital' : 'Analog';
};

export class PinSelectable extends SelectableList<Pin>
    implements IPinSelectable {
    key(p: Pin): string {
        const sd = p.digital ? 'd' : 'a';
        return sd + '.' + p.id.toString();
    }
}
