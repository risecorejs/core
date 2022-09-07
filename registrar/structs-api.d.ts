declare function getRoute(): {
    group: string;
    url: string;
    children: {
        method: string;
        url: string;
        controller: typeof indexController;
        docs: {
            description: string;
            params: {
                'codes[]': {
                    value: string;
                };
                codes: {
                    value: string;
                };
            };
        };
    }[];
};
declare function indexController(req: any, res: any): any;
declare function getDocs(): {
    description: string;
    params: {
        'codes[]': {
            value: string;
        };
        codes: {
            value: string;
        };
    };
};
