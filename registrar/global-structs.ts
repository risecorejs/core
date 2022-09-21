import { setGlobalStructs } from '@risecorejs/helpers'

import { IConfigStructs } from '../interfaces'

export default function (configStructs: IConfigStructs) {
  setGlobalStructs(configStructs.dir)
}
