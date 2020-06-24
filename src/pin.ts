import { SelectableList } from './selectable-list';

export interface Pin {
  digital: boolean;
  id: number;
  label: string;
  purpose: string;
}

export const pinKey = (p: Pin): string => {
  const sd = p.digital ? 'd' : 'a';
  return sd + '.' + p.id.toString();
  // ${p.digital} + "." + ${p.id};
};

export const signalText = (signal: boolean): string => {
  return signal ? 'Digital' : 'Analog';
};

export class Pins extends SelectableList<Pin> {
  LOCAL_STORAGE_KEY = 'micro.pins';
  key(p: Pin): string {
    return pinKey(p);
  }
}
