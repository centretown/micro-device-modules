import { Pin, PinSelectable, IPinSelectable } from './pin';
import { IStoreableList } from './storeable-list';
import { SelectableList } from './selectable-list';

interface DeviceBase {
    ip: string;
    model: string;
    label: string;
}

interface DeviceSave extends DeviceBase {
    pins: Pin[];
}

export interface Device extends DeviceBase {
    pins: PinSelectable;
}

export interface IDeviceStorable extends IStoreableList<Device> {}

export class DeviceStoreable extends SelectableList<Device>
    implements IDeviceStorable {
    LOCAL_STORAGE_KEY = 'micro.devices';
    key(item: Device): string {
        return item.ip;
    }

    /**
     * save the list to local storage
     */
    save(): void {
        const list = this.sort();
        let saveList: DeviceSave[] = [];

        list.forEach((e) => {
            const item: DeviceSave = {
                ip: e.ip,
                label: e.label,
                model: e.model,
                pins: e.pins.sort(),
            };
            saveList = [...saveList, item];
        });

        try {
            localStorage.setItem(
                this.LOCAL_STORAGE_KEY,
                JSON.stringify(saveList),
            );
        } catch (error) {
            // todo: better than this
            throw new Error('problem saving to storage: ' + error);
        }
    }
    /**
     * load list from storage
     * @returns true if somethings there otherwise false
     */
    load(): boolean {
        const storage = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (!storage || storage === '') {
            return false;
        }
        const list: DeviceSave[] = JSON.parse(storage);
        if (list.length === 0) {
            return false;
        }

        list.forEach((e) => {
            const d: Device = {
                ip: e.ip,
                label: e.label,
                model: e.model,
                pins: new PinSelectable(),
            };
            d.pins.putList(e.pins);
            this.put(d);
        });
        return true;
    }
}
