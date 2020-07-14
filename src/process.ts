import { IStoreableList, StoreableList } from './storeable-list';
import { SelectableList } from './selectable-list';
import { ActionSelectable, Action } from './action';

interface ProcessBase {
    label: string;
    deviceKey: string;
    purpose: string;
}

interface ProcessSave extends ProcessBase {
    setup: Action[];
    loop: Action[];
}

export interface Process extends ProcessBase {
    setup: ActionSelectable;
    loop: ActionSelectable;
}

export interface IProcessStoreable extends IStoreableList<Process> {}

export class ProcessStoreable extends StoreableList<Process>
    implements IProcessStoreable {
    LOCAL_STORAGE_KEY = 'micro.process';
    key(proc: Process) {
        return proc.label;
    }
    newItem(): Process {
        return {
            deviceKey: '',
            label: '',
            purpose: '',
            setup: new ActionSelectable(),
            loop: new ActionSelectable(),
        };
    }
    /**
     * save the process list to local storage
     */
    save(): void {
        const list = this.sort();
        let saveList: ProcessSave[] = [];

        list.forEach((e) => {
            const item: ProcessSave = {
                label: e.label,
                deviceKey: e.deviceKey,
                purpose: e.purpose,
                setup: e.setup.sort(),
                loop: e.loop.sort(),
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
     * load process list from storage
     * @returns true if somethings there otherwise false
     */
    load(): boolean {
        const storage = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (!storage || storage === '') {
            return false;
        }
        const list: ProcessSave[] = JSON.parse(storage);
        if (list.length === 0) {
            return false;
        }

        list.forEach((e) => {
            const d: Process = {
                label: e.label,
                deviceKey: e.deviceKey,
                purpose: e.purpose,
                setup: new ActionSelectable(),
                loop: new ActionSelectable(),
            };
            d.setup.putList(e.setup);
            d.loop.putList(e.loop);
            this.put(d);
        });
        return true;
    }
}
