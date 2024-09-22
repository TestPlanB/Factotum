
import { hvigor, HvigorLogger, HvigorNode, HvigorPlugin, Json5Reader, levels } from '@ohos/hvigor'
import {
  OhosHapContext,
  OhosHarContext,
  OhosHspContext,
  OhosPluginId,
  Target
} from '@ohos/hvigor-ohos-plugin'
import fs from 'fs'
import { FactotumConfig } from './FactotumConfig'
import { FactotumPlugin } from './FactotumPlugin'


type ContextLike = OhosHapContext | OhosHarContext | OhosHspContext

const HAP_PLUGIN_ID = 'FACTOTUM_HAP_HMROUTER_PLUGIN'
const HSP_PLUGIN_ID = 'FACTOTUM_HSP_HMROUTER_PLUGIN'
const HAR_PLUGIN_ID = 'FACTOTUM_HAR_HMROUTER_PLUGIN'

const Logger = HvigorLogger.getLogger()


export function factotumHapPlugin(): HvigorPlugin {
  return {
    pluginId: HAP_PLUGIN_ID,
    apply(node: HvigorNode) {
      FactotumTask(node, OhosPluginId.OHOS_HAP_PLUGIN)
    }
  }
}

export function factotumHspPlugin(): HvigorPlugin {
  return {
    pluginId: HSP_PLUGIN_ID,
    apply(node: HvigorNode) {
      FactotumTask(node, OhosPluginId.OHOS_HSP_PLUGIN)
    }
  }
}

export function factotumHarPlugin(): HvigorPlugin {
  return {
    pluginId: HAR_PLUGIN_ID,
    apply(node: HvigorNode) {
      FactotumTask(node, OhosPluginId.OHOS_HAR_PLUGIN)
    }
  }
}


function FactotumTask(node: HvigorNode, pluginId: string) {
  let deleteTask = function deleteGeneratorFile(modulePathArr: string[]) {
    Logger.info('deleteGeneratorFile exec...', modulePathArr)
    for (let modulePath of modulePathArr) {
      if (fs.existsSync(modulePath + '/' + "src/main/ets/_generated")) {
        fs.rmSync(modulePath + '/' + "src/main/ets/_generated", {
          recursive: true
        })
        Logger.log('delete generated dir')
      }
    }
    modulePathArr = []
  }

  let modulePathArr: string[] = []
  modulePathArr.push(node.getNodePath())
  Logger.info(`FactotumTask Exec ${pluginId}..., node:${node.getNodeName()}, nodePath:${node.getNodePath()}`)
  hvigor.nodesEvaluated(async () => {
    const context = node.getContext(pluginId) as ContextLike
    if (!context) {
      throw new Error('errorMsg: context is null 请检查插件的hvigorfile配置')
    }
    context.targets((target: Target) => {
      const targetName = target.getTargetName()
      node.registerTask({
        name: `${targetName}@FactotumPluginTask`,
        run: () => {
          let plugin = new FactotumPlugin(new FactotumConfig(node.getNodeName(), node.getNodePath()))
          plugin.analyzeAnnotation('src/main/ets/_generated')
          let taskName = 'Package' + pluginId.split('.')[2].charAt(0).toUpperCase() + pluginId.split('.')[2].slice(1)
          node.getTaskByName(`${targetName}@${taskName}`)?.afterRun(() => {
           // deleteTask(modulePathArr)
          })
        },
        dependencies: [`${targetName}@PreBuild`],
        postDependencies: [`${targetName}@MergeProfile`]
      })
    })
  })
}

