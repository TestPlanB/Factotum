
export interface LaunchInfo {
  launchName: string,
  dependencies?: string[]
}

export const LAUNCH_TAG = "factotum_tag"

export function Launcher(info: LaunchInfo) {
  return function(target: any) {
    target.prototype[LAUNCH_TAG] = info.launchName
  };
}

