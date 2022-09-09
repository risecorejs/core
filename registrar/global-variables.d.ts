import { IFields } from '../interfaces';
export default function (configGlobalVariables: IFields): void;
declare global {
    export var $: {
        [key: string]: any;
    };
}
