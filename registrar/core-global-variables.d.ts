export default function (): void;
declare global {
    export var $getController: (controllerPath: string) => (method: string) => string;
    export var $env: (key: string, defaultValue?: any) => any;
}
