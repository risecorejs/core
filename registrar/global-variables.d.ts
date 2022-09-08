export default function (globalVariables: {
    [key: string]: any;
}): void;
declare global {
    export var $: {
        [key: string]: any;
    };
}
