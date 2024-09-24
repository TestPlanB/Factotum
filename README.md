# Factotum
Factotum 是专门为HarmonyOS设计的任务调度管理框架，能够在编译时构建出有向无环图，同时也拥有任务循环依赖（成环问题）的发现能力，助力大型项目的任务调度


# 使用指南
Factotum 提供注解@Launcher，用于修饰一个任务类，launchName为当前任务的名字，dependencies为依赖任务的数组，无依赖则为null，同时提供ITask接口用于后期任务调度运行，例子如下（详细例子请查看entry目录下例子）：
## 环境依赖
oh-package.json5 中添加依赖 @pika/factotum 1.0.0 

## 添加编译时插件
在项目entry下hvigorfile.ts 中添加factotumHapPlugin任务依赖
```
export default {
    system: hapTasks,  /* Built-in plugin of Hvigor. It cannot be modified. */
    plugins:[factotumHapPlugin()]         /* Custom plugin to extend the functionality of Hvigor. */
}
```

## @Launcher修饰实现ITask的类
```
@Launcher({
  launchName:"Test2",
  dependencies:["Test1"]
})
export class Test2 implements ITask{
  onLaunch(): void {
    hilog.error(0, "hello", "Test2  onLaunch")
  }
}
```

## @LauncherManager 启动整个任务
@LauncherManager 用于全体管理任务类，可接受实现ITask的任务数组，启动任务时只需要调用 FactotumLauncher.getInstance().launchAll() 方法即可，无需关注任务的依赖顺序
```
@LauncherManager([new Test1(),new Test2(),new Test3(),new Test4()])
export class Launcher{

  launchAll(){
    FactotumLauncher.getInstance().launchAll()
  }

}
```


