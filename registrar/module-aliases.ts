import moduleAlias from 'module-alias'

import { IConfigModuleAliases } from '../interfaces'

export default function (configModuleAliases: IConfigModuleAliases) {
  moduleAlias.addAliases(configModuleAliases)
}
