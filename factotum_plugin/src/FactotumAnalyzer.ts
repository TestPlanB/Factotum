
import ts from 'typescript'
import fs from 'fs'

import { HvigorLogger } from '@ohos/hvigor'
import path from 'path'
import { LaunchInfo } from './launcher'
import { TaskGraph } from './TaskGraph'

const Logger = HvigorLogger.getLogger()

export class Analyzer {
  customAnnotationExisted: boolean = false
  analyzeResultMap: Map<string, LaunchInfo> = new Map()
  private sourcePath: string

  private analyzeArray: LaunchInfo[] = []

  constructor(sourcePath: string) {
    this.sourcePath = sourcePath
  }


  start():string[] {
    const sourceCode = fs.readFileSync(this.sourcePath, 'utf-8')
    const sourceFile = ts.createSourceFile(
      this.sourcePath,
      sourceCode,
      ts.ScriptTarget.ES2021,
      false
    )

    ts.forEachChild(sourceFile, node => {
      this.resolveNode(node)
    })
    // 生成任务依赖
    let graph = new TaskGraph()
    this.analyzeArray.forEach((fn: LaunchInfo) => {
      graph.addDependence(fn.launchName,fn.dependencies)
    })
    let result = graph.detectCycleNodes()
    Logger.info(`graph.detectCycleNodes ${result.join(",")}`)
    return result

  }

  // 解析AST语法树，只解析我们认定的结果
  private resolveNode(node: ts.Node) {
    if (ts.isClassDeclaration(node)) {
      this.resolveClass(node)
    } else if (ts.isDecorator(node)) {
      this.resolveDecorator(node)
    }
  }

  private resolveClass(node: ts.ClassDeclaration) {
    // 解析到类声明，先清空一次返回结果
    node.modifiers?.forEach(modifier => {
      // 遍历分析装饰器
      this.resolveNode(modifier)
    })

  }

  private resolveDecorator(node: ts.Decorator) {
    if (ts.isCallExpression(node.expression)) {
      const callExpression = node.expression as ts.CallExpression
      if (ts.isIdentifier(callExpression.expression)) {
        this.switchIdentifier(callExpression)
      }
    }
  }

  private switchIdentifier(callExpression: ts.CallExpression) {
    const identifier = callExpression.expression as ts.Identifier
    Logger.info(`identifier.text: ${identifier.text}`)

    if (identifier.text == "Launcher") {
      this.customAnnotationExisted = true
      // 区分是什么装饰器，构造不同的返回类
      Logger.info(`callExpression.arguments: ${callExpression.arguments.length}`)
      if (callExpression.arguments.length > 0) {
        this.resolveCallExpression(callExpression)
      }
    }
  }

  private resolveCallExpression(node: ts.CallExpression) {
    this.parseAnnotation(node.arguments)
  }


  private parseAnnotation(args: ts.NodeArray<ts.Expression>) {
    if (args[0] as ts.ObjectLiteralExpression) {
      if (args[0].properties) {
        let analyzeResult: LaunchInfo = {
          launchName: ""
        }
        args[0].properties.forEach(property => {
          if (property && ts.isPropertyAssignment(property)) {
            // 获取属性的名称
            const name = property.name.text;
            // 获取属性的值
            const initializer = property.initializer;
            // 处理属性名和初始化器
            if (ts.isStringLiteral(initializer)) {
              analyzeResult.launchName = initializer.text
            } else if (ts.isArrayLiteralExpression(initializer)) {
              let dependencies: string[] = []
              initializer.elements.forEach((node) => {
                if (ts.isStringLiteral(node)) {
                  dependencies.push(node.text)
                }
              })
              analyzeResult.dependencies = dependencies
              Logger.info("resolve dependencies " + dependencies.join(","))
            }
          }
        });
        // 加入
        this.analyzeArray.push(analyzeResult)
      }
    }
  }
}
