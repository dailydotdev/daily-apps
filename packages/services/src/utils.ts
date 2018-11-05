export function ratioToSize(ratio: number): string {
    if (ratio > 1.5) {
        return 'small';
    }

    if (ratio <= 0.75) {
        return 'large';
    }

    return 'medium';
}

type Reviver = (key: any, value: any) => any;
const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

export function dateReviver(_: string, value: string): any {
    if (typeof value === 'string' && dateFormat.test(value)) {
        return new Date(value);
    }

    return value;
}

export function reviveJSON(data: any, revivers: (Reviver | Reviver[]) = []): any {
    let reviversArray: Reviver[];
    if (!(revivers instanceof Array)) {
        reviversArray = [revivers];
    } else {
        reviversArray = revivers;
    }
    return Object.keys(data).reduce((res: any, key: string) => {
        const newVal: any = reviversArray.reduce((val: any, reviver: Reviver) => reviver(key, val), data[key]);
        return Object.assign({}, res, {[key]: newVal});
    }, {});
}