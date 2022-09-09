import { IConfigCron, IConfigCronJobs } from '../interfaces/config';
export default function (configCron: IConfigCron): void;
/**
 * CRON-RUNNER
 * @param cronJobs {IConfigCronJobs}
 */
export declare function cronRunner(cronJobs: IConfigCronJobs): void;
