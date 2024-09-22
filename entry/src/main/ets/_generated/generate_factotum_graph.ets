import { FactotumLauncher, ITask } from 'factotum';

export function getGraph():string[] {
  return [
      "Test1",
      "Test4",
      "Test2",
      "Test3",
  ]
}



export function LauncherManager(info: ITask[]) {
  return (target: Function) => {
    FactotumLauncher.getInstance().setGraphInner(getGraph())
    FactotumLauncher.getInstance().addTasks(info);
  };
}