import { FactotumLauncher } from 'factotum';
import { Launcher } from '../test/Launcher';
import { Test1, Test2, Test3 } from '../test/Test';
import { LauncherManager } from '../_generated/generate_factotum_graph';

@Entry
@Component
struct Index {
  @State message: string = 'Hello World';
  launcher:Launcher = new Launcher()

  build() {
    RelativeContainer() {

      Button('查看任务顺序').onClick(() => {
       this.launcher.launchAll()
      })
        .alignRules({
          center: { anchor: '__container__', align: VerticalAlign.Center },
          middle: { anchor: '__container__', align: HorizontalAlign.Center }
        })
    }
    .height('100%')
    .width('100%')
  }
}