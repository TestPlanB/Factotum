import { FactotumConfig } from './FactotumConfig'
import path from 'path'
import fs from 'fs'
import Handlebars from 'handlebars'
import { HvigorLogger } from '@ohos/hvigor'
import { Analyzer } from './FactotumAnalyzer'

const Logger = HvigorLogger.getLogger()

export class FactotumPlugin {
  private scanFiles: string[] = []
  config: FactotumConfig
  scanDir: string[] = ['src/main/ets']

  constructor(con: FactotumConfig) {
    this.config = con
  }


  generateGraph(target: string[],generatePath:string) {
    const builderPath = path.resolve(__dirname, 'factotum_template.txt')
    Logger.info(`builderPath is ${builderPath}`)
    const tpl = fs.readFileSync(builderPath, { encoding: 'utf-8' })
    const template = Handlebars.compile(tpl)
    const content = { graphs: target }
    const output = template(content)
    Logger.info(`output is ${output}`)
    const modDir = this.config.modulePath
    const routerBuilderDir = `${modDir}/${generatePath}`
    if (!fs.existsSync(routerBuilderDir)) {
      fs.mkdirSync(routerBuilderDir)
    }
    fs.writeFileSync(`${routerBuilderDir}/generate_factotum_graph.ets`, output, {
      encoding: 'utf-8'
    })
    Logger.info(`routerBuilderDir ${routerBuilderDir}`)
  }

  private deepScan(scanPath: string, filePath: string) {
    if (fs.lstatSync(`${scanPath + filePath}`).isDirectory()) {
      const files: string[] = fs.readdirSync(`${scanPath}${filePath}`)
      files.forEach(file => {
        this.deepScan(`${scanPath}${filePath}/`, file)
      })
    } else {
      this.scanFiles.push(`${scanPath}${filePath}`)
    }
  }

  analyzeAnnotation(generatePath:string ) {
    this.scanDir.forEach(scanDir => {
      const scanPath = `${this.config.modulePath}/${scanDir}`
      this.deepScan(scanPath, '')
    })

    Logger.info(`扫描到${this.scanFiles.length}个文件`, this.scanFiles)
    let finalResult:string[] = []
    this.scanFiles.forEach(filePath => {
      if (filePath.endsWith('.ets') || (filePath.endsWith('.ts'))) {
        const analyzer = new Analyzer(filePath)
        let result = analyzer.start()
        if (result.length > 0) {
          finalResult = finalResult.concat(result)
        }
      }
    })

    // 生成最终的产物
    if (finalResult.length > 0) {
      this.generateGraph(finalResult,generatePath)
    }
  }
}