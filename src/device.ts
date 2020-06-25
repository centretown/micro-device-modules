import { PinSelectable, IPinSelectable } from './pin';
import { IStoreableList, StoreableList } from './storeable-list';

export interface Device {
    ip: string;
    model: string;
    label: string;
    pins: PinSelectable;
}

export interface IDeviceStorable extends IStoreableList<Device> {}

export class DeviceStoreable extends StoreableList<Device>
    implements IDeviceStorable {
    LOCAL_STORAGE_KEY = 'micro.devices';
    key(item: Device): string {
        return item.ip;
    }
}
