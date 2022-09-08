import moduleAlias from 'module-alias'

import { IConfigModuleAliases } from '../interfaces/config'

export default function (configModuleAliases: IConfigModuleAliases) {
  moduleAlias.addAliases(configModuleAliases)
}
