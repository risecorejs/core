export default function (configGlobalVariables: {
    [key: string]: any;
}): void;
declare global {
    export var $: {
        [key: string]: any;
    };
}
