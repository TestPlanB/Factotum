import { FactotumLauncher } from 'factotum';
import { LauncherManager } from '../_generated/generate_factotum_graph';
import { Test1, Test2, Test3, Test4 } from './Test';

@LauncherManager([new Test1(),new Test2(),new Test3(),new Test4()])
export class Launcher{

  launchAll(){
    FactotumLauncher.getInstance().launchAll()
  }

}