export default function (): void;
declare global {
    export var $controller: (filename: string) => (method: string) => string;
    export var $env: (key: string, defaultValue?: any) => any;
}
