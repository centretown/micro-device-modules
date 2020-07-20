import { IStoreableList, StoreableList } from './storeable-list';
import { ActionSelectable, Action } from './action';
import { Device } from './device';

interface ProcessBase {
    label: string;
    deviceKey: string;
    purpose: string;
}

interface ProcessFlat extends ProcessBase {
    setup: Action[];
    loop: Action[];
}

export interface Process extends ProcessBase {
    setup: ActionSelectable;
    loop: ActionSelectable;
}

export interface IProcessStoreable extends IStoreableList<Process> {}

export interface ProcessResponse extends Response {
    parsedBody?: string;
}

export class ProcessStoreable extends StoreableList<Process>
    implements IProcessStoreable {
    LOCAL_STORAGE_KEY = 'micro.process';
    key(proc: Process) {
        return proc.label;
    }
    newItem(): Process {
        return {
            label: '',
            deviceKey: '',
            purpose: '',
            setup: new ActionSelectable(),
            loop: new ActionSelectable(),
        };
    }

    /**
     * flatten replaces class instances with arrays
     */
    flatten(e: Process): ProcessFlat {
        const flat: ProcessFlat = {
            label: e.label,
            deviceKey: e.deviceKey,
            purpose: e.purpose,
            setup: e.setup.sort(),
            loop: e.loop.sort(),
        };
        return flat;
    }

    /**
     * unflatten replaces arrays with class instances
     */
    unflatten(flat: ProcessFlat): Process {
        const process: Process = {
            label: flat.label,
            deviceKey: flat.deviceKey,
            purpose: flat.purpose,
            setup: new ActionSelectable(),
            loop: new ActionSelectable(),
        };
        process.setup.putList(flat.setup);
        process.loop.putList(flat.loop);
        return process;
    }

    /**
     * save the process list to local storage
     */
    save(): void {
        let flatList: ProcessFlat[] = [];
        this.sort().forEach((e) => {
            flatList = [...flatList, this.flatten(e)];
        });

        try {
            localStorage.setItem(
                this.LOCAL_STORAGE_KEY,
                JSON.stringify(flatList),
            );
        } catch (error) {
            throw new Error('problem saving to storage: ' + error);
        }
    }

    /**
     * load process list from storage
     * @returns true if somethings there otherwise false
     */
    load(): boolean {
        const storage = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (!storage) {
            return false;
        }
        const list: ProcessFlat[] = JSON.parse(storage);
        list.forEach((e) => {
            this.put(this.unflatten(e));
        });
        return true;
    }

    async send(process: Process, device: Device): Promise<ProcessResponse> {
        const body = JSON.stringify(this.flatten(process));
        const response: ProcessResponse = await fetch(device.ip, {
            method: 'POST', // always
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length.toString(),
            },
            body: `${body}`,
        });

        response.parsedBody = await response.json();
        return response;
    }
}
