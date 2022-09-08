import moduleAlias from 'module-alias'

import { IConfigModuleAliases } from '../interfaces/config'

export default function (configModuleAliases: IConfigModuleAliases | false) {
  if (configModuleAliases) {
    moduleAlias.addAliases(configModuleAliases)
  }
}
