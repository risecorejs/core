import moduleAlias from 'module-alias'

import { IConfigModuleAlias } from '../interfaces/config'

export default function (aliases: IConfigModuleAlias | false) {
  if (aliases) {
    moduleAlias.addAliases(aliases)
  }
}
