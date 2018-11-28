function getSizeFromRatio(ratio: number): string {
    if (ratio > 1.5) {
        return 'small';
    }

    if (ratio <= 0.75) {
        return 'large';
    }

    return 'medium';
}

export function ratioToSize(obj: any, def: string = 'small'): any {
    const newObj = Object.assign({}, obj);
    if (newObj.ratio) {
        newObj.size = getSizeFromRatio(newObj.ratio);
    } else {
        newObj.size = def;
    }
    delete newObj.ratio;
    return newObj;
}

type Reviver = (key: any, value: any) => any;
const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

export function dateReviver(_: string, value: string): any {
    if (typeof value === 'string' && dateFormat.test(value)) {
        return new Date(value);
    }

    return value;
}

function reviveValue(data: any, key: string, revivers: Reviver[]): any {
    if (data[key] && data[key].constructor === Object) {
        return reviveJSON(data[key], revivers)
    }

    return revivers.reduce((val: any, reviver: Reviver) => reviver(key, val), data[key])
}

export function reviveJSON(data: any, revivers: (Reviver | Reviver[]) = []): any {
    const reviversArray: Reviver[] = revivers instanceof Array ? revivers : [revivers];
    return Object.keys(data).reduce((res: any, key: string) => {
        return Object.assign({}, res, {[key]: reviveValue(data, key, reviversArray)});
    }, {});
}