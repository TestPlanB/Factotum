
import { HvigorLogger } from '@ohos/hvigor'
const Logger = HvigorLogger.getLogger()

export class TaskGraph {
  taskGraph: Map<string, string[]> = new Map()
  allTaskSet: Set<string> = new Set()


  addDependence(current:string,dependencies:string []|null|undefined){
    if (this.allTaskSet.has(current)){
      throw new Error(`当前已经存在名字为${current} 的任务，请检查`)
    }
    this.allTaskSet.add(current)
    if (!dependencies){
      this.taskGraph.set(current,[])
      return
    }
    dependencies.forEach((preTask)=>{
      if (!this.taskGraph.has(preTask)) {
        this.taskGraph.set(preTask,[])
      }
      let taskGroups: string[] = this.taskGraph.get(preTask)
      taskGroups.push(current)
      this.taskGraph.set(preTask,taskGroups)
    })

  }


  detectCycleNodes(): string[] {
    let indegree = new Map<string, number>()
    let queue:string[] = []
    let cycleNodes:string[]=[]

    // 计算入度
    this.taskGraph.forEach((value: string[]) => {
      value.forEach((node)=>{
        indegree.set(node,(indegree.get(node) ?? 0) + 1)
      })
    })

    this.taskGraph.forEach((value: string[], key: string) => {
      let currentNode = indegree.get(key) ?? 0
      if (currentNode == 0) {
        queue.push(key)
      }
    })

    let count = 0
    let result: string[] = []
    while (queue.length > 0) {
      let node = queue.pop()
      result.push(node)

      count++
      this.taskGraph.get(node)?.forEach((it: string) => {
        indegree.set(it,indegree.get(it)  - 1)
        if (indegree.get(it) == 0) {
          queue.push(it)
        }
      })
    }
    if (count != this.allTaskSet.size) {
      indegree.forEach((value: number, key: string) => {
        if (value > 0) {
          cycleNodes.push(key)
        }
      })
      throw new Error(`Found cycle dependencies:  ${cycleNodes.join(", ")}`)
    }
    return result
  }
}