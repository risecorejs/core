import { setGlobalStructs } from '@risecorejs/helpers'

import { IConfigStructs } from '../interfaces/config'

export default function (structs: IConfigStructs) {
  setGlobalStructs(structs.dir)
}
