import { setGlobalStructs } from '@risecorejs/helpers'

import { IConfigStructs } from '../interfaces/config'

export default function (configStructs: IConfigStructs) {
  setGlobalStructs(configStructs.dir)
}
