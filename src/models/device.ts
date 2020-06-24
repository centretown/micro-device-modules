import { Pin } from './pin'

export interface Device {
  label: string;
  model: string;
  ip: string;
  selected?: boolean;
  pins?: Pin[];
}
