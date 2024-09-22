
import { hilog } from '@kit.PerformanceAnalysisKit'
import { ITask, Launcher } from 'factotum'


@Launcher({
  launchName:"Test1"
})
export class Test1 implements ITask{
  onLaunch(): void {
    hilog.error(0, "hello", "Test1  onLaunch")
  }
}

@Launcher({
  launchName:"Test2",
  dependencies:["Test1"]
})
export class Test2 implements ITask{
  onLaunch(): void {
    hilog.error(0, "hello", "Test2  onLaunch")
  }
}

@Launcher({
  launchName:"Test3",
  dependencies:["Test1","Test2"]
})
export class Test3 implements ITask{
  onLaunch(): void {
    hilog.error(0, "hello", "Test3  onLaunch")
  }
}

@Launcher({
  launchName:"Test4",
  dependencies:["Test1"]
})
export class Test4 implements ITask{
  onLaunch(): void {
    hilog.error(0, "hello", "Test4  onLaunch")
  }
}

