import processesRunner from '@risecorejs/processes-runner'

import { IProcesses } from '@risecorejs/processes-runner/interfaces'

export default async function (configProcesses: IProcesses) {
  await processesRunner(configProcesses)
}
