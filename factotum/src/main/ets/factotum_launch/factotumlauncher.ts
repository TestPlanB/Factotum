import { ITask } from './itask'
import { LAUNCH_TAG } from './launcher'


export class FactotumLauncher{

  private static instance: FactotumLauncher

  private tasks:Map<string,ITask> = new Map()

  private graph:string[] =[]

  private constructor() {
  }

  public addTask(node:ITask){
    this.tasks.set(node[LAUNCH_TAG],node)
  }

  public addTasks(node:ITask[]){
    node.forEach((task)=>{
      this.tasks.set(task[LAUNCH_TAG],task)
    })
  }

  public setGraphInner(graph:string[]){
    this.graph = graph

  }

  public launchAll(){
    this.graph.forEach((name:string)=>{
      this.tasks.get(name)?.onLaunch()
    })
  }

  public static getInstance(): FactotumLauncher {
    if (!FactotumLauncher.instance) {
      FactotumLauncher.instance = new FactotumLauncher()
      return FactotumLauncher.instance
    }
    return FactotumLauncher.instance
  }

}